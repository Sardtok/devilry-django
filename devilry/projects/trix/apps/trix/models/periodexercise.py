from django.utils.translation import ugettext as _
from django.db import models

from devilry.apps.core.models.period import Period
from devilry.apps.core.models.custom_db_fields import ShortNameField, LongNameField

from exercise import Exercise

class PeriodExercise(models.Model):
    """
    An exercise given for a certain period.

    .. attribute:: period

        The period the exercise has been given for.

    .. attribute:: exercise

        The exercise that has been given.

    .. attribute:: points

        The number of points given for the exercise this period.
    """

    class Meta:
        app_label = 'trix'
        unique_together = ('period', 'exercise')

    period = models.ForeignKey(Period, related_name="exercises",
                               verbose_name=_('Period'))
    exercise = models.ForeignKey(Exercise, related_name="periods",
                                 verbose_name=_('Exercise'))
    points = models.PositiveIntegerField(blank=True)

    def clean(self, *args, **kwargs):
        if points.value is None:
            points.value = exercise.rel.to.points.value

