from django.utils.translation import ugettext as _
from django.contrib.auth.models import User
from django.db import models

from periodexercise import PeriodExercise
from status import Status

class ExerciseStatus(models.Model):
    """
    Status set for an exercise done by a student.

    .. attribute:: time_done
    
        The time the exercise was reported done.

    .. attribute:: exercise
    
        A django.db.models.ForeignKey_ to a PeriodExercise
        which represents the exercise that was done.

    .. attribute:: status
    
        A django.db.models.ForeignKey_ to the status set for the exercise.

    .. attribute:: student
    
        A django.db.models.ForeignKey_ to the student who did the exercise.
    """

    class Meta:
        app_label = 'trix'
        ordering = ['time_done']
        unique_together = ('student', 'exercise')

    student = models.ForeignKey(User, related_name='exercise_results',
                                verbose_name = _('Student'))
    exercise = models.ForeignKey(PeriodExercise, related_name='student_results',
                                 verbose_name = _('Exercise'))
    status = models.ForeignKey(Status, related_name='exercises',
                               verbose_name = _('Status'))
    time_done = models.DateTimeField(auto_now=True)

    def clean(self, *args, **kwargs):
        """
        Validate the exercise status.

        Raises ValidationError if the user isn't a student in that period,
        or if the status is not an active status.
        """
        if not self.status.active:
            raise ValidationError(_("The status that was set is not active: %b"
                                    % (status.rel.to.active)))

        #student_check = exercise.period.relatedstudents.get(id=student.rel.to.id)
        #if student_check is None:
        #    raise ValidationError(_('You\'re not a student for this period.'))
