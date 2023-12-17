from django.db import models

# Create your models here.

class GameState(models.Model):
    grid = models.TextField()
    ant_pos_x = models.IntegerField()
    ant_pos_y = models.IntegerField()
    ant_orientation = models.CharField(max_length=10)