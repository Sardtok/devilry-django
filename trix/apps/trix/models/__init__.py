from topic import Topic
from exercise import Exercise
from periodexercise import PeriodExercise
from status import Status
from exercisestatus import ExerciseStatus
from django.db.models.signals import post_delete
from django.dispatch import receiver

@receiver(post_delete, sender=PeriodExercise)
def delete_handler(sender, **kwargs):
    for key in kwargs:
        if (key=="instance"):
            kwargs[key].shift_items_down();

