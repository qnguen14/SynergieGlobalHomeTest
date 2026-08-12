using BPLM.Domain.DTO.Lesson;
using BPLM.Domain.Entities;
using BPLM.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BPLM.API.Controllers;

/// <summary>
/// API endpoints for managing lessons in BrightPath Lesson Manager.
/// </summary>
[ApiController]
[Route("api/lesson")]
[Produces("application/json")]
public class LessonController : ControllerBase
{
    private readonly ILessonService _lessonService;

    public LessonController(ILessonService lessonService)
    {
        _lessonService = lessonService;
    }

    /// <summary>
    /// Gets all lessons filtered and sorted by date (defaults to today's date if empty).
    /// </summary>
    /// <returns>A list of lessons sorted by Date and StartTime.</returns>
    /// <response code="200">Returns the list of lessons.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Lesson>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLessons([FromQuery] DateOnly? date)
    {
        var lessons = await _lessonService.GetLessonsAsync(date);
        return Ok(lessons);
    }

    /// <summary>
    /// Gets all lessons across all dates without date filtering.
    /// </summary>
    /// <returns>A list of all lessons sorted by Date and StartTime.</returns>
    /// <response code="200">Returns the complete list of lessons.</response>
    [HttpGet("all")]
    [ProducesResponseType(typeof(IEnumerable<Lesson>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllLessons()
    {
        var lessons = await _lessonService.GetAllLessonsAsync();
        return Ok(lessons);
    }

    /// <summary>
    /// Gets details of a specific lesson by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the lesson.</param>
    /// <returns>The requested lesson details.</returns>
    /// <response code="200">Returns the requested lesson.</response>
    /// <response code="404">If no lesson exists with the specified ID.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Lesson), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLessonById(string id)
    {
        var lesson = await _lessonService.GetLessonByIdAsync(id);
        if (lesson == null) return NotFound(new { message = $"Lesson with ID '{id}' not found." });
        return Ok(lesson);
    }

    /// <summary>
    /// Creates a new lesson with an auto-generated Lesson ID.
    /// </summary>
    /// <param name="request">Lesson creation details.</param>
    /// <returns>The newly created lesson entity.</returns>
    /// <response code="201">Lesson created successfully.</response>
    /// <response code="400">If the request model state is invalid.</response>
    [HttpPost]
    [ProducesResponseType(typeof(Lesson), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateLesson([FromBody] CreateLessonRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var createdLesson = await _lessonService.CreateLessonAsync(request);
            return CreatedAtAction(nameof(GetLessonById), new { id = createdLesson.LessonID }, createdLesson);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates details of an existing lesson.
    /// </summary>
    /// <param name="id">The unique identifier of the lesson to update.</param>
    /// <param name="request">Updated lesson fields.</param>
    /// <returns>The updated lesson entity.</returns>
    /// <response code="200">Lesson updated successfully.</response>
    /// <response code="400">If the request payload is invalid.</response>
    /// <response code="404">If no lesson exists with the specified ID.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Lesson), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateLesson(string id, [FromBody] UpdateLessonRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var updatedLesson = await _lessonService.UpdateLessonAsync(id, request);
            if (updatedLesson == null) return NotFound(new { message = $"Lesson with ID '{id}' not found." });
            return Ok(updatedLesson);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Cancels a lesson and appends optional cancellation notes.
    /// </summary>
    /// <param name="id">The unique identifier of the lesson to cancel.</param>
    /// <param name="request">Optional notes describing the reason for cancellation.</param>
    /// <returns>The cancelled lesson entity.</returns>
    /// <response code="200">Lesson cancelled successfully.</response>
    /// <response code="404">If no lesson exists with the specified ID.</response>
    [HttpPatch("{id}/cancel")]
    [ProducesResponseType(typeof(Lesson), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelLesson(string id, [FromBody] CancelLessonRequest request)
    {
        var cancelledLesson = await _lessonService.CancelLessonAsync(id, request);
        if (cancelledLesson == null) return NotFound(new { message = $"Lesson with ID '{id}' not found." });
        return Ok(cancelledLesson);
    }

    /// <summary>
    /// Toggles the IsExam flag for a lesson between true and false.
    /// </summary>
    /// <param name="id">The unique identifier of the lesson.</param>
    /// <returns>The updated lesson entity with toggled IsExam status.</returns>
    /// <response code="200">IsExam toggled successfully.</response>
    /// <response code="404">If no lesson exists with the specified ID.</response>
    [HttpPatch("{id}/toggle-exam")]
    [ProducesResponseType(typeof(Lesson), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleExam(string id)
    {
        try
        {
            var toggledLesson = await _lessonService.ToggleExamAsync(id);
            if (toggledLesson == null) return NotFound(new { message = $"Lesson with ID '{id}' not found." });
            return Ok(toggledLesson);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deletes a lesson by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the lesson to delete.</param>
    /// <response code="204">Lesson deleted successfully.</response>
    /// <response code="404">If no lesson exists with the specified ID.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteLesson(string id)
    {
        var success = await _lessonService.DeleteLessonAsync(id);
        if (!success) return NotFound(new { message = $"Lesson with ID '{id}' not found." });
        return NoContent();
    }
}
