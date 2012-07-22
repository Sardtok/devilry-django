from topic import Topic
from exercise import Exercise
from period import Period
from periodexercise import PeriodExercise
from periodgroup import PeriodGroup
from status import Status
from exercisestatus import ExerciseStatus
from django.db.models.signals import post_delete
from django.dispatch import receiver

@receiver(post_delete, sender=PeriodExercise)
def delete_handler(sender, **kwargs):
    try:
        kwargs['instance'].shift_items_down();
    except Period.DoesNotExist:
        pass
