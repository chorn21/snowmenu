from django.db import models

class User(models.Model):
    ldap_name = models.CharField(max_length=100)

class FoodSnowman(models.Model):
    user = models.ForeignKey(User)
    value = models.IntegerField()

class Food(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    food_type = models.CharField(max_length=100)
    gluten = models.BooleanField()
    onions = models.BooleanField()
    nuts = models.BooleanField()
    vegetarian = models.BooleanField()
    dairy = models.BooleanField()

    snowmen = models.ManyToManyField(FoodSnowman)

    @property
    def get_snowmen(self):
        return self.snowmen.filter(value=1).count()

    @property
    def get_puddles(self):
        return self.snowmen.filter(value=-1).count()

class Menu(models.Model):
    date = models.CharField(max_length=10)
    foods = models.ManyToManyField(Food)
 
class CommentSnowman(models.Model):
    user = models.ForeignKey(User)
    value = models.IntegerField()

class Comment(models.Model):
    user = models.ForeignKey(User)
    menu = models.ForeignKey(Menu)
    comment = models.CharField(max_length=300)
    snowmen = models.ManyToManyField(CommentSnowman)

    @property 
    def get_snowmen(self):
        return self.snowmen.filter(value=1).count()

    @property
    def get_puddles(self):
        return self.snowmen.filter(value=-1).count()

# Create your models here.
