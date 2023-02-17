let taskID = "";
let taskName = "";
let done = false;
let show = false;
let asc = true;

$(document).ready(function () {
  $("#showAll").prop("checked", false);

  $("#showAll").click(function () {
    show = $("#showAll").is(":checked");
    getAllTasks();
  });

  $("#sort").click(function () {
    asc = !asc;
    getAllTasks();
  });

  getAllTasks();
  $("#edit").on("click", saveTask);
  $("#delete").on("click", deleteToDo);

  $("#add").prop("disabled", true);
  $("#newTaskName").keyup(function () {
    if ($(this).val() != "") {
      $("#add").prop("disabled", false);
    } else {
      $("#add").prop("disabled", true);
    }
  });
  $("#add").on("click", addToDo);
});

// FUNCTIONS

function getAllTasks() {
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

function checkToShow(task) {
  if (show) {
    return task;
  } else {
    return task.completed === false;
  }
}

function createList(lists) {
  $("#taskList").children().remove();

  if (asc) {
    lists.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
  } else {
    lists.sort((a, b) => {
      if (b.id < a.id) {
        return -1;
      }
      if (b.id > a.id) {
        return 1;
      }
      return 0;
    });
  }

  let filterList = lists.filter(checkToShow);

  filterList.map(function (task) {
    $("#taskList").append(
      $("<div/>", { class: "row" })
        .append(
          $("<div/>", { class: "col-1 d-flex justify-content-center" }).append(
            $("<input/>", {
              class: "updateTask",
              type: "checkbox",
              onclick: "updateMark()",
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
              class: "updateTask fa-solid fa-pen-to-square",
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

function addToDo() {
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
      getAllTasks();
      $("#newTaskName").val("");
    },

    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });

  $("#newTaskName").val("");
  $("#add").prop("disabled", true);
}

function updateMark() {
  $.ajax({
    url: getTask(),
    success: function () {
      console.log(done, taskID);
      var URL = "";
      if (done) {
        URL =
          "https://fewd-todolist-api.onrender.com/tasks/" +
          taskID +
          "/mark_complete?api_key=107";
      } else {
        URL =
          "https://fewd-todolist-api.onrender.com/tasks/" +
          taskID +
          "/mark_active?api_key=107";
      }

      $.ajax({
        type: "PUT",
        url: URL,
        contentType: "application/json",
        dataType: "json",
        success: function (response, textStatus) {
          getAllTasks();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        },
      });
    },
  });
}

function updateTask() {
  $.ajax({
    url: getTask(),
    success: function () {
      $("#editTaskName").val(taskName);
    },
  });
}

function deleteTask() {
  $("body").on("click", ".fa-trash", function () {
    taskID = $(this).parent().prev().prev().prev().prev().text();
    taskName = $(this).parent().prev().prev().prev().text();
    $("#taskToDelete").text(taskName);
  });
}

function deleteToDo() {
  $.ajax({
    type: "DELETE",
    url:
      "https://fewd-todolist-api.onrender.com/tasks/" + taskID + "?api_key=107",

    success: function (response, textStatus) {
      getAllTasks();
    },

    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
}

function getTask() {
  $("body").on("click", ".updateTask", function () {
    taskID = $(this).parent().parent().children("div").first().next().text();
    taskName = $(this)
      .parent()
      .parent()
      .children("div")
      .first()
      .next()
      .next()
      .text();
    done = $(this)
      .parent()
      .parent()
      .children("div")
      .first()
      .children("input")
      .first()
      .is(":checked");
  });
}

function saveTask() {
  $.ajax({
    type: "PUT",
    url:
      "https://fewd-todolist-api.onrender.com/tasks/" + taskID + "?api_key=107",

    contentType: "application/json",

    dataType: "json",

    data: JSON.stringify({
      task: { content: $("#editTaskName").val() },
    }),

    success: function (response, textStatus) {
      getAllTasks();
      $("#editTaskName").val("");
    },

    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
}
