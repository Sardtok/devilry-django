from topic import Topic
from exercise import Exercise
from periodexercise import PeriodExercise
from status import Status
from exercisestatus import ExerciseStatus
from django.db.models.signals import post_delete
from django.dispatch import receiver
from devilry.apps.core.models.period import Period

@receiver(post_delete, sender=PeriodExercise)
def delete_handler(sender, **kwargs):
    try:
        kwargs['instance'].shift_items_down();
    except Period.DoesNotExist:
        pass
