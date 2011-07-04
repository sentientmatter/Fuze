# Introduction
Fuze is a lightweight javascript template engine designed to turn javascript objects into rendered html in a standard, intuitive, and simple way. Fuze does not use a proprietary template language, so there is nothing new to learn; if you are familiar with jQuery and the DOM, Fuze is cake.

# Example
Using Fuze is straightforward. Given the following HTML:

    <div id="contactInfo">
	    Name: <span class="firstName"></span> <span class="lastName"></span><br />
	    Phone: <span class="phone"></phone>
	
	    <div class="address">
		    Address: <span class="street"></street><br />
		    <span class="city"></city>, <span class="state"></span> <span class="zipcode"></span>
	    </div>
    </div>

And the following javascript object:

    var contact = {
	    firstName: 	'Bill',
	    lastName: 	'Jones',
	    phone:	'555-1234',
	    address: {
		    street: '123 Fake Street',
		    city:	'Salida',
		    state: 	'CO',
		    zipcode: '81201'
	    }
    };

We can inject the object into the html by running fuze() on the matched element.
    
	$('#contactInfo').fuze(contact);

Which produces this:

    <div id="contactInfo">
	    Name: <span class="firstName">Bill</span> <span class="lastName">Jones</span><br />
	    Phone: <span class="phone">555-1234</phone>
	
	    <div class="address">
		    Address: <span class="street">123 Fake Street</street><br />
		    <span class="city">Salida</city>, <span class="state">CO</span> <span class="zipcode">81201</span>
	    </div>
    </div>