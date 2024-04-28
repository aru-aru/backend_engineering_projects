class Validator {
  static validateTaskInfo(taskInfo) {
    const errors = []; // Array to store validation errors

    // Check for required properties
    if (!taskInfo.hasOwnProperty("title")) {
      errors.push("Title is required");
    }
    if (!taskInfo.hasOwnProperty("description")) {
      errors.push("Description is required");
    }
    if (!taskInfo.hasOwnProperty("completed")) {
      errors.push("Completed status is required");
    }

    // Validate title and description (not empty)

    const titleValidationResult = this.validateTitle(taskInfo);
    console.log(titleValidationResult);
    if (titleValidationResult.status == false) {
      errors.push(titleValidationResult.message);
    }

    const descriptionValidationResult = this.validateDescription(taskInfo);
    if (!descriptionValidationResult.status) {
      errors.push(descriptionValidationResult.message);
    }

    // Validate completed status (boolean)
    const statusValidationResult = this.validateStatus(taskInfo);
    if (!statusValidationResult.status) {
      errors.push(statusValidationResult.message);
    }
    console.log(errors);
    // Return validation result
    if (errors.length > 0) {
      let errorMessage = "Task info is invalid: "; // Start with a base message
      errorMessage += errors.join(", "); // Join all errors with commas
      return {
        status: false,
        message: errorMessage,
      };
    } else {
      return {
        status: true,
        message: "Validated successfully",
      };
    }
  }

  static validateId(userProvidedId, tasks) {
    const matchingTask = tasks.find(
      (task) => task.id === parseInt(userProvidedId)
    );
    if (!matchingTask) {
      return {
        status: false,
        message: "Task ID doesn't exist",
      };
    } else {
      return {
        status: true,
        message: "Validated successfully",
      };
    }
  }
  static validateStatus(taskInfo) {
    // Validate completed status (boolean)
    if (taskInfo.completed && typeof taskInfo.completed !== "boolean") {
      return {
        status: false,
        message: "Completed status must be true or false",
      };
    }
    return {
      status: true,
    };
  }

  static validateTitle(taskInfo) {
    // Validate completed status (boolean)
    if (taskInfo.title && taskInfo.title.trim() !== "") {
      return {
        status: true,
      };
    }
    return {
      status: false,
      message: "Title cannot be empty",
    };
  }

  static validateDescription(taskInfo) {
    // Validate completed status (boolean)
    if (taskInfo.description && taskInfo.description.trim() !== "") {
      return {
        status: true,
      };
    }
    return {
      status: false,
      message: "Description cannot be empty",
    };
  }
}

module.exports = Validator;
