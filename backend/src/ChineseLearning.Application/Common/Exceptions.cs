namespace ChineseLearning.Application.Common;

public class ValidationException(string message) : Exception(message);

public class NotFoundException(string message) : Exception(message);
