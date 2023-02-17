$(document).ready(function () {
  // Get Task from API
  getTasks();

  // Add Task
  $("#add").prop("disabled", true);
  $("#newTaskName").keyup(function () {
    if ($(this).val() != "") {
      $("#add").prop("disabled", false);
    } else {
      $("#add").prop("disabled", true);
    }
  });
  $("#add").on("click", function () {
    console.log($("#newTaskName").val());

    $.ajax({
      type: "POST",
      url: "https://fewd-todolist-api.onrender.com/tasks?api_key=107",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        task: {
          content: $("#newTaskName").val(),
        },
      }),

      success: function (response, textStatus) {
        getTasks();
      },

      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });

    $("#newTaskName").val("");
    $("#add").prop("disabled", true);
  });

  // Update Task
  $("#edit").prop("disabled", true);
  $("#editTaskName").on("keyup click", function () {
    if ($(this).val() != "") {
      $("#edit").prop("disabled", false);
    } else {
      $("#edit").prop("disabled", true);
    }
  });

  $("#edit").on("click", edit);

  // Delete Task
  $("#delete").on("click", function () {
    $.ajax({
      type: "DELETE",
      url:
        "https://fewd-todolist-api.onrender.com/tasks/" +
        taskID +
        "?api_key=107",

      success: function (response, textStatus) {
        getTasks();
      },

      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  });
});

function getTasks() {
  $("#taskList").children().remove();
  $.ajax({
    type: "GET",
    url: "https://fewd-todolist-api.onrender.com/tasks?api_key=107",
    dataType: "json",

    success: function (response, textStatus) {
      createList(response.tasks);
    },

    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
}

function edit() {
  //   taskID = $(this).parent().parent().first().next().text();
  //   taskName = $(this).parent().first().next().next().text();
  //   done = $(this).is(":checked");
  //console.log(check);
  console.log(done);
  console.log(taskID);
  console.log(taskName);
  $.ajax({
    type: "PUT",

    url:
      "https://fewd-todolist-api.onrender.com/tasks/" + taskID + "?api_key=107",

    contentType: "application/json",

    dataType: "json",

    data: JSON.stringify({
      task: {
        completed: done,
      },
    }),

    success: function (response, textStatus) {
      console.log(response);
    },

    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
}

function updateTask() {
  $("body").on("click", ".fa-pen-to-square", function () {
    taskID = $(this).parent().prev().prev().prev().text();
    taskName = $(this).parent().prev().prev().text();
    done = $(this).parent().prev().prev().prev().is(":checked");
    $("#editTaskName").val(taskName);
  });
}

function updateCheck() {
  $("body").on("click", ".check", function () {
    taskID = $(this).parent().next().text();
    taskName = $(this).parent().next().next().text();
    done = $(this).is(":checked");
    console.log(taskID);
    console.log(taskName);
    console.log(done);
    //edit();
  });

  // $("body").on("click", ".check", function () {
  //   taskName = $(this).parent().next().next().text();
  //   taskID = $(this).parent().next().text();
  //   done = $(this).is(":checked");
  //   edit;
  // });
}

function deleteTask() {
  $("body").on("click", ".fa-trash", function () {
    taskID = $(this).parent().prev().prev().prev().prev().text();
    taskName = $(this).parent().prev().prev().prev().text();
    $("#taskToDelete").text(taskName);
  });
}

function createList(lists) {
  console.log(lists);
  lists.map(function (task) {
    $("#taskList").append(
      $("<div/>", { class: "row" })
        .append(
          $("<div/>", { class: "col-1 d-flex justify-content-center" }).append(
            $("<input/>", {
              class: "check",
              type: "checkbox",
              onclick: "updateCheck()",
              checked: task.completed,
            })
          )
        )
        .append(
          $("<div/>", {
            class: "col-1 d-flex justify-content-center",
            text: task.id,
          })
        )
        .append(
          $("<div/>", {
            class: "col-5 d-flex justify-content-center",
            text: task.content,
          })
        )
        .append(
          $("<div/>", {
            class: "col-3 d-flex justify-content-center",
            text: task.created_at.slice(0, 10).split("-").reverse().join("-"),
          })
        )
        .append(
          $("<div/>", {
            class: "col-1 text-info d-flex justify-content-center",
          }).append(
            $("<i/>", {
              class: "fa-solid fa-pen-to-square",
              onclick: "updateTask()",
            })
              .attr("data-bs-toggle", "modal")
              .attr("data-bs-target", "#editTaskModal")
          )
        )
        .append(
          $("<div/>", {
            class: "col-1 text-danger d-flex justify-content-center",
          }).append(
            $("<i/>", {
              class: "fa-solid fa-trash",
              onclick: "deleteTask()",
            })
              .attr("data-bs-toggle", "modal")
              .attr("data-bs-target", "#deleteTaskModal")
          )
        )
        .append($("<div/>").append("<hr/>"))
    );
  });
}
