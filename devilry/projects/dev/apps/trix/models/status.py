from django.utils.translation import ugettext as _
from django.db import models

from devilry.apps.core.models.period import Period

from exercise import Exercise

class Status(models.Model):
    """
    A status that can be set for an exercise (e.g. completed).

    .. attribute:: active

        Whether this status can currently be used for exercises.

    .. attribute:: percentage

        The percentage of points awarded for doing an exercise with this status.
    """

    class Meta:
        app_label = 'trix'

    name = models.SlugField()
    active = models.BooleanField(default=True)
    percentage = models.DecimalField(max_digits=3, decimal_places=2)

