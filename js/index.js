const baseURL = "http://api.login2explore.com:5577";
const endpoint = "/api/iml";
const endpointForGet = "/api/irl";
const dbName = "SCHOOL-DB";
const rel = "STUDENT-TABLE";
const token = "90934937|-31949251798839432|90959459"; // Replace if needed

const resetForm = () => {
    $("#studentForm")[0].reset();
    $("#rollNo").prop("disabled", false).focus();
    enableFields(false);
    $("#saveBtn, #updateBtn").prop("disabled", true);
};

const enableFields = (enable = true) => {
    $("#fullName, #class, #birthDate, #address, #enrollmentDate").prop("disabled", !enable);
};

const isValidForm = () => {
    return $("#rollNo").val() && $("#fullName").val() && $("#class").val() &&
        $("#birthDate").val() && $("#address").val() && $("#enrollmentDate").val();
};

const getFormData = () => ({
    RollNo: $("#rollNo").val().trim(),
    FullName: $("#fullName").val().trim(),
    Class: $("#class").val().trim(),
    BirthDate: $("#birthDate").val(),
    Address: $("#address").val().trim(),
    EnrollmentDate: $("#enrollmentDate").val()
});

const findStudentByRollNo = async (rollNo, callback) => {
    const searchQuery = {
        token: token,
        dbName: dbName,
        cmd: "GET_BY_KEY",
        rel: rel,
        jsonStr: { RollNo: rollNo }
    };

    // console.log("Sending GET_BY_KEY request", searchQuery);

    try {
        const response = await fetch(baseURL + endpointForGet, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(searchQuery)
        });

        const result = await response.json();
        return result.data || null;
    } catch (error) {
        console.error("GET_BY_KEY failed:", error);
        return null;
    }

};

const saveStudent = () => {
    if (!isValidForm()) return alert("Please fill all fields.");

    const data = getFormData();
    const payload = {
        token: token,
        cmd: "PUT",
        dbName: dbName,
        rel: rel,
        jsonStr: data
    };

    $.ajax({
        url: baseURL + endpoint,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (res) {
            alert("Record saved!");
            resetForm();
        }
    });
};

const updateStudent = () => {
    if (!isValidForm()) return alert("Please fill all fields.");

    const data = getFormData();

    const updatePayload = {
        token: token,
        cmd: "UPDATE",
        dbName: dbName,
        rel: rel,
        jsonStr: {
            [data.RollNo]: {
                FullName: data.FullName,
                Class: data.Class,
                BirthDate: data.BirthDate,
                Address: data.Address,
                EnrollmentDate: data.EnrollmentDate
            }
        }
    };

    $.ajax({
        url: baseURL + endpoint,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(updatePayload),
        success: function (res) {
            alert("Record updated!");
            resetForm();
        }
    });
};

$(document).ready(function () {
    resetForm();

    $("#rollNo").on("blur", function () {
        const rollNo = $(this).val().trim();
        if (!rollNo) return;
        console.log("RollNo blur triggered");  

        findStudentByRollNo(rollNo, function (record) {


            if (record) {
                // Existing record - populate form
                $("#rollNo").prop("disabled", true);
                $("#fullName").val(record.FullName);
                $("#class").val(record.Class);
                $("#birthDate").val(record.BirthDate);
                $("#address").val(record.Address);
                $("#enrollmentDate").val(record.EnrollmentDate);
                enableFields(true);
                $("#updateBtn").prop("disabled", false);
                // console.log("Response:", record);  
            } else {
                console.log("Response:", record);  
                // New record
                $("#rollNo").prop("disabled", true);
                enableFields(true);
                $("#saveBtn").prop("disabled", false);
                $("#fullName").focus();
            }
        });
    });


    $("#saveBtn").click(saveStudent);
    $("#updateBtn").click(updateStudent);
    $("#resetBtn").click(resetForm);


});
