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

    .. attribute:: starred

        Whether this exercise has been "starred" for this period.
        This can be used to emphasize important exercises.
    """

    class Meta:
        app_label = 'trix'
        unique_together = (('period', 'exercise'), ('period', 'number'))
        ordering = ['number']

    period = models.ForeignKey(Period, related_name="exercises",
                               verbose_name=_('Period'))
    exercise = models.ForeignKey(Exercise, related_name="periods",
                                 verbose_name=_('Exercise'))
    number = models.PositiveIntegerField();
    points = models.PositiveIntegerField()
    starred = models.BooleanField(default=False)

    def clean(self, *args, **kwargs):
        if self.points <= 0:
            self.points = self.exercise.points
        exercises = PeriodExercise.objects.filter(period=self.period)

        try:
            exercises.get(number=self.number)
        except:
            pass
        else:
            self.shift_items_up();

        if self.number <= 0:
            self.number = self.get_next(exercises)

    def shift_items_up(self):
        exercises = PeriodExercise.objects.filter(period=self.period).filter(number__gte=self.number).order_by('-number')
        for exercise in exercises:
            exercise.number = exercise.number + 1
            exercise.save()

    def get_next(self, exercises):
        last = exercises.aggregate(max=models.Max('number'))['max']
        if last is None:
            last = 0
        return last + 1

    def shift_items_down(self):
        exercises = PeriodExercise.objects.filter(period=self.period).filter(number__gte=self.number)
        for exercise in list(exercises):
            exercise.number = exercise.number - 1
            exercise.save()
