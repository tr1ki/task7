// Demo processing for console output

function processMenuItems() {
    const data = [
        { id: 1, name: 'Margherita', price: 12.99, category: 'pizza' },
        { id: 2, name: 'Pepperoni', price: 15.99, category: 'pizza' },
        { id: 3, name: 'BBQ Chicken', price: 17.99, category: 'pizza' },
        { id: 4, name: 'Supreme', price: 19.99, category: 'pizza' },
        { id: 5, name: 'Coca Cola', price: 2.99, category: 'drink' },
        { id: 6, name: 'Orange Juice', price: 3.99, category: 'drink' }
    ];
    const processed = data.map(i => ({ ...i, displayName: i.name.toUpperCase(), isExpensive: i.price > 15 }));
    const pizzas = processed.filter(i => i.category === 'pizza');
    pizzas.forEach(i => console.log(`Pizza: ${i.displayName} - $${i.price}`));
    return processed;
}


