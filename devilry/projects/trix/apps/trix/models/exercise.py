from django.utils.translation import ugettext as _
from django.db import models
from devilry.apps.core.models.custom_db_fields import ShortNameField, LongNameField

from topic import Topic

class Exercise(models.Model):
    """
    An exercise.

    .. attribute:: text

        The actual exercise text.

    .. attribute:: topics

        A django.db.models.ManyToManyField_ that points to related topics.

    .. attribute:: prerequisites

        A django.db.models.ManyToManyField_ that points to topics
        of which one requires previous knowledge to complete this exercise.
    """

    class Meta:
        app_label = 'trix'
        verbose_name = _('Exercise')
        verbose_name_plural = _('Exercises')

    short_name = ShortNameField(unique=True)
    long_name = LongNameField()

    text = models.TextField()
    points = models.PositiveIntegerField()
    topics = models.ManyToManyField(Topic, related_name='exercises', blank=True)
    prerequisites = models.ManyToManyField(Topic, related_name='required_for',
                                           blank=True)
