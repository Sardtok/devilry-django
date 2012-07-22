from django.utils.translation import ugettext as _
from django.core.exceptions import ValidationError
from django.db import models

from period import Period
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
        """
        Cleans the model by ensuring we don't get colliding
        exercise numbers for this exercise's period.
        """
        super(PeriodExercise, self).clean(*args, **kwargs)
        try:
            self.exercise
            self.period
        except:
            return

        if self.points <= 0:
            self.points = self.exercise.points
        
        exercises = PeriodExercise.objects.filter(period=self.period)

        try:
            old = exercises.get(pk=self.pk)
        except:
            try:
                other = exercises.get(number=self.number)
            except:
                pass
            else:
                # This happens when a new exercise is created
                # Move all other exercises out of the way
                self.shift_items_up()
        else:
            # Move only the exercises with numbers between
            # the new and old number
            if self.number < old.number:
                self.shift_items_up(old.number)
            elif self.number > old.number:
                self.shift_items_down(old.number)

        if self.number <= 0:
            self.number = self.get_next(exercises)

    def shift_items_up(self, to_number=-1):
        """
        Moves all exercise numbers between self.number and to_number up.
        I.e. increase other exercises' numbers.
        """
        exercises = PeriodExercise.objects.filter(period=self.period).filter(number__gte=self.number).order_by('-number')
        if to_number != -1:
            new_number = self.number
            self.number = self.get_next(exercises)
            self.save()
            exercises = exercises.filter(number__lt=to_number)

        for exercise in exercises:
            exercise.number = exercise.number + 1
            exercise.save()
        
        if to_number != -1:
            self.number = new_number
            # If we don't save, a second call to clean breaks the period's exercise numbers
            self.save()

    def get_next(self, exercises):
        """
        Similar to an auto-increment.
        Get the number just above the highest exercise number for this period.
        """
        last = exercises.aggregate(max=models.Max('number'))['max']
        if last is None:
            last = 0
        return last + 1

    def shift_items_down(self, from_number=-1):
        """
        Shifts all exercise numbers between self.number and from_number down.
        I.e. decrease other exercises' numbers.
        """
        if from_number == -1:
            exercises = PeriodExercise.objects.filter(period=self.period).filter(number__gte=self.number)
        else:
            exercises = PeriodExercise.objects.filter(period=self.period)
            new_number = self.number
            self.number = self.get_next(exercises)
            self.save()
            exercises = exercises.filter(number__gt=from_number).filter(number__lte=new_number)
        
        for exercise in list(exercises):
            exercise.number = exercise.number - 1
            exercise.save()
        
        if from_number != -1:
            self.number = new_number
            # If we don't save, a second call to clean breaks the period's exercise numbers
            self.save()
