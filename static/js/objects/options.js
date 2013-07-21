
function Options(gluten, onions, nuts, dairy, vegetarian) {
    this.gluten = gluten; // true if item contains gluten, false if gluten-free
    this.onions = onions; // true if item contains onions, false if onion-free
    this.nuts = nuts; // true if item contains nuts, false if item is nut-free
    this.dairy = dairy; // true if item contains dairy, false if item is dairy-free
    this.vegetarian = vegetarian; // true if item is a vegetarian option, false if item is a carnivorous option
}