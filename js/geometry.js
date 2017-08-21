var geometryCalcs = (function() {
    // Inputs and outputs
    var type = "poly";
    var num_sides = 6;
    var len1 = 0;
    var len2 = 0;
    var len3 = 0;
    var int_radius = 0;
    var ext_radius = 0;
	var int_dia = 0;
	var ext_dia = 0;
    var height = 0;
    var area1 = 0;
	var area2 = 0;
	var area3 = 0;
    var angle1 = 0;
    var angle2 = 0;
	var radius = 0;
	var diameter = 0;
	var dia2 = 0;
	var circum  =0;

    var dps = 3;

	//
	// Initialise the form
	//
	function initialise() {
		$("#btnCalc").click(function(){calculateForm()});
		$("#btnClear").click(function(){clearForm()});
		$("#btnHelp").click(function(){helpForm()});
		$("#btnBack").click(function(){backForm()});

		// Set the step size for numeric fields to avoid complaints from browsers
		var step = Math.pow(10, -dps);
		$("#fldRadius").attr("step", step);
		$("#fldDiameter").attr("step", step);
		$("#fldCircum").attr("step", step);
		$("#fldCArea").attr("step", step);
		$("#fldSegAngle").attr("step", step);
		$("#fldSegHeight").attr("step", step);
		$("#fldChordLen").attr("step", step);
		$("#fldChordDepth").attr("step", step);
		
		$("#fldSideLen").attr("step", step);
		$("#fldIntRad").attr("step", step);
		$("#fldIntDia").attr("step", step);
		$("#fldExtRad").attr("step", step);
		$("#fldExtDia").attr("step", step);
		$("#fldGHeight").attr("step", step);
		$("#fldGArea").attr("step", step);

		$("#fldTriLen1").attr("step", step);
		$("#fldTriLen2").attr("step", step);
		$("#fldTriLen3").attr("step", step);
		$("#fldTriAng1").attr("step", step);
		$("#fldTriAng2").attr("step", step);
		$("#fldTriArea").attr("step", step);

		$("#fldRecSide1").attr("step", step);
		$("#fldRecSide2").attr("step", step);
		$("#fldRecDiag").attr("step", step);
		$("#fldRecArea").attr("step", step);

		$("#fldPcdDia").attr("step", step);
		$("#fldPcdAng").attr("step", step);
		$("#fldPcdSize").attr("step", step);

		$("#fldSinLen").attr("step", step);
		$("#fldSinHgt").attr("step", step);
		$("#fldSinAng").attr("step", step);

    }

	//
	// Parse a field - the value must be zero (default) or in the range min to max
	// If max < min it is ignored
	//
	function parseField(obj, name, min, max) {
		var n = 0;
		var s = obj.val().trim();
		if (s.length == 0) {
			n = 0;
		} else {
			n = parseFloat(s);
			if (isNaN(n)) {
				showAlert("The %1 is not valid".replace("%1", name));
				return NaN;
			}

			if (n == 0) {
				return n;
			}

			if (n < min) {
				showAlert("The %1 must be at least %2".replace("%1", name).replace("%2", min));
				return NaN;
			}

			if ((max > min) && (n > max)) {
				showAlert("The %1 must be no more than %2".replace("%1", name).replace("%2", max));
				return NaN;
			}
		}

		return n;
	}
    
	//
	// Show a decimal value to the standard number of DPs
	//
	function showValue(obj, val) {
		obj.val(val.toFixed(dps).toString());
	}

	//
	// Reset a field to a value (no formatting needed)
	//
	function resetField(obj, val) {
		obj.val(val);
	}
	
	//
	// Show alerts in a browser-friendly manner
	//
	function showAlert(message) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, null, "OK");
		} else {
			alert(message);
		}
	}
	
	//
	// Parse fields for a circle
	//
	function parseCircle() {
		// Basic dimensions (only one needed)
		radius = parseField($("#fldRadius"), "radius", 0, -1);
		if (isNaN(radius)) {
			return false;
		}

		diameter = parseField($("#fldDiameter"), "diameter", 0, -1);
		if (isNaN(diameter)) {
			return false;
		}

		circum = parseField($("#fldCircum"), "circumference", 0, -1);
		if (isNaN(circum)) {
			return false;
		}

		area1 = parseField($("#fldCArea"), "area", 0, -1);
		if (isNaN(area1)) {
			return false;
		}

		// Segment and chord dimensions - only one needed
		angle1 = parseField($("#fldSegAngle"), "segment angle", 0, 180);
		if (isNaN(angle1)) {
			return false;
		}

		len1 = parseField($("#fldSegHeight"), "segment height", 0, -1);
		if (isNaN(len1)) {
			return false;
		}

		len2 = parseField($("#fldChordLen"), "chord length", 0, -1);
		if (isNaN(len2)) {
			return false;
		}

		len3 = parseField($("#fldChordDepth"), "chord depth", 0, -1);
		if (isNaN(len3)) {
			return false;
		}

		return true;
	}

	//
	// Calculate basic and segment details for a circle
	//
	function calculateCircle() {
		if (!parseCircle())
			return;
		
		// Find the first non-zero value and calculate the others
		if (radius != 0) {
			diameter = radius * 2;
			circum = diameter * Math.PI;
			area1 = radius * radius * Math.PI;
		}
		else if (diameter != 0) {
			radius = diameter / 2;
			circum = diameter * Math.PI;
			area1 = radius * radius * Math.PI;
		}
		else if (circum != 0) {
			diameter = circum / Math.PI;
			radius = diameter / 2;
			area1 = radius * radius * Math.PI;
		}
		else if (area1 != 0) {
			radius = Math.sqrt(area1 / Math.PI);
			diameter = radius * 2;
			circum = diameter * Math.PI;
		}
		else {
			showAlert("Please supply the radius, diameter, circumference or area");
			return;
		}

		// Do the same for the segment - this is optional
		// len1 = segment height (centre to chord), len2 = chord length, len3 = chord depth (edge to chord)
		if (angle1 != 0) {
			len1 = radius * Math.cos((Math.PI / 180) * angle1 / 2);
			len2 = 2 * radius * Math.sin((Math.PI / 180) * angle1 / 2);
			len3 = radius - len1;
		}
		else if (len1 != 0) {
			len2 = 2 * Math.sqrt(radius * radius - len1 * len1);
			len3 = radius - len1;
			angle1 = 2 * (180 / Math.PI) * Math.acos(len1 / radius);
		}
		else if (len2 != 0) {
			len1 = Math.sqrt(radius * radius - len2 * len2 / 4);
			len3 = radius - len1;
			angle1 = 2 * (180 / Math.PI) * Math.acos(len1 / radius);
		}
		else if (len3 != 0) {
			len1 = radius - len3;
			len2 = 2 * Math.sqrt(radius * radius - len1 * len1);
			angle1 = 2 * (180 / Math.PI) * Math.acos(len1 / radius);
		}
		
		// Calculate a couple of areas
		area2 = len1 * len2 / 2;				// Segment area
		area3 = (area1 * angle1 / 360) - area2;	// Chord area

		// Display the results
		showValue($("#fldRadius"), radius);
		showValue($("#fldDiameter"), diameter);
		showValue($("#fldCircum"), circum);
		showValue($("#fldCArea"), area1);
		showValue($("#fldSegAngle"), angle1);
		showValue($("#fldSegHeight"), len1);
		showValue($("#fldChordLen"), len2);
		showValue($("#fldChordDepth"), len3);
		showValue($("#fldSegArea"), area2);
		showValue($("#fldChordArea"), area3);
	}
	
	//
	// Reset the circle fields
	//
	function clearCircle() {
		resetField($("#fldRadius"), "0");
		resetField($("#fldDiameter"), "0");
		resetField($("#fldCircum"), "0");
		resetField($("#fldCArea"), "0");
		resetField($("#fldSegAngle"), "0");
		resetField($("#fldSegHeight"), "0");
		resetField($("#fldChordLen"), "0");
		resetField($("#fldChordDepth"), "0");
		resetField($("#fldSegArea"), "");
		resetField($("#fldChordArea"), "");
	}
	
	//
	// Parse the fields on the polygon form - only two should be filled including the number of sides
	//
	function parsePolygon() {
		// Number of sides - at least 3
		num_sides = parseInt($("#fldSides").val());
		if (isNaN(num_sides) || (num_sides < 3)) {
			showAlert("Please select a number of sides, 3 or more");
			return false;
		}

		// Side length
		len1 = parseField($("#fldSideLen"), "side length", 0, -1);
		if (isNaN(len1)) {
			return false;
		}

		// Internal radius
		int_radius = parseField($("#fldIntRad"), "internal radius", 0, -1);
		if (isNaN(int_radius)) {
			return false;
		}

		// Internal diameter
		int_dia = parseField($("#fldIntDia"), "internal diameter", 0, -1);
		if (isNaN(int_dia)) {
			return false;
		}

		// External radius
		ext_radius = parseField($("#fldExtRad"), "external radius", 0, -1);
		if (isNaN(ext_radius)) {
			return false;
		}

		// External diameter
		ext_dia = parseField($("#fldExtDia"), "external diameter", 0, -1);
		if (isNaN(ext_dia)) {
			return false;
		}

		// Overall height
		height = parseField($("#fldGHeight"), "overall height", 0, -1);
		if (isNaN(height)) {
			return false;
		}

		return true;
	}

	//
	// Calculate the side length, internal & external radii, height and area given any of the other values
	//
	function calculatePolygon() {
		if (!parsePolygon())
			return;

		// Calculate the internal and external angles
		var ext_angle = 360 / num_sides;
		var int_angle = 180 - ext_angle;

		// Get some common values to save time later
		var p = Math.cos((Math.PI / 180) * (int_angle / 2));
		var q = Math.tan((Math.PI / 180) * (int_angle / 2));
		var r = q + 1 / p;

		// Calculate side length if we don't already have it
		if (len1 == 0) {
			if (int_radius != 0) {
				len1 = 2 * int_radius / q;
			}
			else if (int_dia != 0) {
				len1 = int_dia / q;
			}
			else if (ext_radius != 0) {
				len1 = 2 * ext_radius * p;
			}
			else if (ext_dia != 0) {
				len1 = ext_dia * p;
			}
			else if (height != 0) {
				if (num_sides % 2 == 0) {
					len1 = height / q;
				}
				else {
					len1 = 2 * height / r;
				}
			}
			else {
				showAlert("Please provide at least one value");
				return;
			}
		}

		// Now calculate all the values that we don't have yet
		if (int_radius == 0) {
			int_radius = q * len1 / 2;
		}

		if (int_dia == 0) {
			int_dia = q * len1;
		}
		
		if (ext_radius == 0) {
			ext_radius = len1 / (2 * p);
		}
		
		if (ext_dia == 0) {
			ext_dia = len1 / p;
		}
		
		if (height == 0) {
			if (num_sides % 2 == 0) {
				height = q * len1;
			}
			else {
				height = r * len1 / 2;
			}
		}

		area1 = num_sides * len1 * int_radius / 2;

		// Display everything
		showValue($("#fldSideLen"), len1);
		showValue($("#fldIntAng"), int_angle);
		showValue($("#fldExtAng"), ext_angle);
		showValue($("#fldIntRad"), int_radius);
		showValue($("#fldIntDia"), int_dia);
		showValue($("#fldExtRad"), ext_radius);
		showValue($("#fldExtDia"), ext_dia);
		showValue($("#fldGHeight"), height);
		showValue($("#fldGArea"), area1);
	}
	
	//
	// Reset the fields on the polygon form
	//
	function clearPolygon() {
		resetField($("#fldSides"), "6");
		resetField($("#fldIntAng"), "");
		resetField($("#fldExtAng"), "");
		resetField($("#fldSideLen"), "0");
		resetField($("#fldIntRad"), "0");
		resetField($("#fldIntDia"), "0");
		resetField($("#fldExtRad"), "0");
		resetField($("#fldExtDia"), "0");
		resetField($("#fldGHeight"), "0");
		resetField($("#fldGArea"), "0");
	}

	//
	// Parse fields for right triangles
	//
	function parseTriangle() {
		// Side lengths
		len1 = parseField($("#fldTriLen1"), "side length 1", 0, -1);
		if (isNaN(len1)) {
			return false;
		}

		len2 = parseField($("#fldTriLen2"), "side length 2", 0, -1);
		if (isNaN(len2)) {
			return false;
		}

		len3 = parseField($("#fldTriLen3"), "hypotenuse", 0, -1);
		if (isNaN(len3)) {
			return false;
		}

		// Angles
		angle1 = parseField($("#fldTriAng1"), "angle 1", 0, 90);
		if (isNaN(angle1)) {
			return false;
		}

		angle2 = parseField($("#fldTriAng2"), "angle 2", 0, 90);
		if (isNaN(angle2)) {
			return false;
		}

		// Area
		area1 = parseField($("#fldTriArea"), "area", 0, -1);
		if (isNaN(area1)) {
			return false;
		}

		return true;
	}

	//
	// Calculate the sides, angles and area for a right triangle
	//
	function calculateTriangle() {
		if (!parseTriangle())
			return;
		
		// If we have two angles, make sure they're sensible
		if (angle1 + angle2 > 90) {
			showAlert("The sum of the angles cannot exceed 90 degrees");
			return;
		}
			
		// Find the side lengths if necessary
		if ((len1 == 0) || (len2 == 0))
		{
			// Work from the hypotenuse
			if (len3 != 0) {
				if (len1 != 0) {
					len2 = Math.sqrt(len3 * len3 - len1 * len1);
				}
				else if (len2 != 0) {
					len1 = Math.sqrt(len3 * len3 - len2 * len2);
				}
				else if (angle1 != 0) {
					len1 = len3 * Math.sin((Math.PI / 180) * angle1);
					len2 = Math.sqrt(len3 * len3 - len1 * len1);
				}
				else if (angle2 != 0) {
					len2 = len3 * Math.sin((Math.PI / 180) * angle2);
					len1 = Math.sqrt(len3 * len3 - len2 * len2);
				}
				else if (area1 != 0) {
					var s = len3 * len3 * len3 * len3 - 16 * area1 * area1;
					if (s < 0) {
						showAlert("The area is not possible with the entered hypotenuse");
						return;
					}
					len1 = Math.sqrt((len3 * len3 + Math.sqrt(s)) / 2);
					len2 = 2 * area1 / len1;
				}
				else {
					showAlert("Please enter at least one length or area and one other measurement");
					return;
				}
			}
			
			// Work from the angles
			else if (angle1 != 0) {
				if (len1 != 0) {
					len2 = len1 / Math.tan((Math.PI / 180) * angle1);
				}
				else if (len2 != 0) {
					len1 = len2 * Math.tan((Math.PI / 180) * angle1);
				}
				else if (area1 != 0) {
					len2 = Math.sqrt(2 * area1 / Math.tan((Math.PI / 180) * angle1));
					len1 = 2 * area1 / len2;
				}
				else {
					showAlert("Please enter at least one length or area and one other measurement");
					return;
				}
			}
			else if (angle2 != 0) {
				if (len1 != 0) {
					len2 = len1 * Math.tan((Math.PI / 180) * angle2);
				}
				else if (len2 != 0) {
					len1 = len2 / Math.tan((Math.PI / 180) * angle2);
				}
				else if (area1 != 0) {
					len1 = Math.sqrt(2 * area1 / Math.tan((Math.PI / 180) * angle2));
					len2 = 2 * area1 / len1;
				}
				else {
					showAlert("Please enter at least one length or area and one other measurement");
					return;
				}
			}
			
			// Work from the area
			else if (area1 != 0) {
				if (len1 != 0) {
					len2 = 2 * area1 / len1;
				}
				else if (len2 != 0) {
					len1 = 2 * area1 / len2;
				}
				else {
					showAlert("Please enter at least one length or area and one other measurement");
					return;
				}
			}
		}

		// Now we can calculate everything
		if (angle1 == 0) {
			angle1 = 180 * Math.atan(len1 / len2) / Math.PI;
		}

		if (angle2 == 0) {
			angle2 = 180 * Math.atan(len2 / len1) / Math.PI;
		}

		if (len3 == 0) {
			len3 = Math.sqrt(len1 * len1 + len2 * len2);
		}

		if (area1 == 0) {
			area1 = len1 * len2 / 2;
		}

		// Display the results
		showValue($("#fldTriLen1"), len1);
		showValue($("#fldTriLen2"), len2);
		showValue($("#fldTriLen3"), len3);
		showValue($("#fldTriAng1"), angle1);
		showValue($("#fldTriAng2"), angle2);
		showValue($("#fldTriArea"), area1);
	}
	
	//
	// Clear the triangle fields
	//
	function clearTriangle() {
		resetField($("#fldTriLen1"), "0");
		resetField($("#fldTriLen2"), "0");
		resetField($("#fldTriLen3"), "0");
		resetField($("#fldTriAng1"), "0");
		resetField($("#fldTriAng2"), "0");
		resetField($("#fldTriArea"), "0");
	}

	//
	// Parse rectangle dimensions
	//
	function parseRectangle() {
		len1 = parseField($("#fldRecSide1"), "side 1", 0, -1);
		if (isNaN(len1)) {
			return false;
		}

		len2 = parseField($("#fldRecSide2"), "side 2", 0, -1);
		if (isNaN(len2)) {
			return false;
		}

		len3 = parseField($("#fldRecDiag"), "diagonal", 0, -1);
		if (isNaN(len3)) {
			return false;
		}

		area1 = parseField($("#fldRecArea"), "area", 0, -1);
		if (isNaN(area1)) {
			return false;
		}

		return true;
	}
	
	//
	// Calculate rectangle dimensions
	//
	function calculateRectangle() {
		if (!parseRectangle())
			return;

		var x = 0;
		
		// Try to get the two sides
		if ((len1 == 0) || (len2 == 0)) {
			if (len1 != 0) {
				if (len3 != 0) {
					x = len3 * len3 - len1 * len1;
					if (x < 0) {
						showAlert("The diagonal is not possible with the supplied side length");
						return;
					}
					len2 = Math.sqrt(x);
				}
				else if (area1 != 0) {
					len2 = area1 / len1;
				}
				else {
					showAlert("Please enter at least two measurements");
					return;
				}
			}
			else if (len2 != 0) {
				if (len3 != 0) {
					x = len3 * len3 - len2 * len2;
					if (x < 0) {
						showAlert("The diagonal is not possible with the supplied side length");
						return;
					}
					len1 = Math.sqrt(x);
				}
				else if (area1 != 0) {
					len1 = area1 / len2;
				}
				else {
					showAlert("Please enter at least two measurements");
					return;
				}
			}
			else if (len3 != 0) {
				if (area1 != 0) {
					x = len3 * len3 * len3 * len3 - 2 * area1 * area1;
					if (x < 0) {
						showAlert("The diagonal is not possible with the supplied area");
						return;
					}
					len1 = Math.sqrt((len3 * len3 + Math.sqrt(x)) / 2);
					len2 = area1 / len1;
				}
				else {
					showAlert("Please enter at least two measurements");
					return;
				}
			}
			else {
				showAlert("Please enter at least two measurements");
				return;
			}
		}

		// Calculate area and diagonal if required
		if (len3 == 0) {
			len3 = Math.sqrt(len1 * len1 + len2 * len2);
		}
		if (area1 == 0) {
			area1 = len1 * len2;
		}
			
		// Display the results
		showValue($("#fldRecSide1"), len1);
		showValue($("#fldRecSide2"), len2);
		showValue($("#fldRecDiag"), len3);
		showValue($("#fldRecArea"), area1);
	}
	
	//
	// Clear the rectangle fields
	//
	function clearRectangle() {
		resetField($("#fldRecSide1"), "0");
		resetField($("#fldRecSide2"), "0");
		resetField($("#fldRecDiag"), "0");
		resetField($("#fldRecArea"), "0");
	}
	
	//
	// Parse PCD dimensions
	//
	function parsePCD() {
		diameter = parseField($("#fldPcdDia"), "PCD", 0, -1);
		if (isNaN(diameter)) {
			return false;
		}

		num_sides = parseField($("#fldPcdNum"), "count", 0, -1);
		if (isNaN(num_sides)) {
			return false;
		}

		angle1 = parseField($("#fldPcdAng"), "angle", 0, -1);
		if (isNaN(angle1)) {
			return false;
		}

		dia2 = parseField($("#fldPcdSize"), "hole size", 0, -1);
		if (isNaN(dia2)) {
			return false;
		}

		return true;
	}
	
	//
	// Calculate PCD (pitch circle diameter) dimensions
	//
	function calculatePCD() {
		if (!parsePCD())
			return;
		
		if (diameter == 0) {
			showAlert("Please enter the pitch circle diameter");
			return;
		}
		
		if ((angle1 == 0) && (num_sides == 0)) {
			showAlert("Please enter the number of holes or the angular separation");
			return;
		}
		
		if (num_sides != 0) {
			angle1 = 360 / num_sides;
		}
		else {
			num_sides = 360 / angle1;
			if (num_sides % 1 !== 0) {
				showAlert("Please enter an angle that gives an integral number of holes");
				return;
			}
		}

		// Find the distance between hole centres and across the holes
		len1 = diameter * Math.sin(Math.PI / num_sides);
		len2 = len1 + dia2;

		// Display the results
		$("#fldPcdNum").val(num_sides.toFixed(0).toString());
		showValue($("#fldPcdAng"), angle1);
		showValue($("#fldPcdCtr"), len1);
		showValue($("#fldPcdCheck"), len2);
		
		// See if coordinates are required
		crd = $('input[name=fldCoord]:checked', '#frmGeometry').val(); // returns string
		if (crd !== "none")
			calculateCoordinates(crd);
	}
	
	//
	// Calculate and display a table of hole coordinates
	//
	function calculateCoordinates(crd) {
		var a = 2 * Math.PI / num_sides;
		var r = diameter / 2;
		var x = y = b = 0;
		var s = "<table style='width:50%;'><tr><th>X</th><th>Y</th></tr>";
		
		for (var i = 0; i < num_sides - 1; i++) {
			b = i * a;
			x = r * Math.sin(b);
			y = r * Math.cos(b);
			
			// If using corner referece, offset the location
			if (crd == "corner") {
				x = r + x;
				y = r - y;
			}
			
			// Build the html
			s += "<tr><td>" + x.toFixed(dps).toString() + "</td><td>" + y.toFixed(dps).toString() + "</td></tr>";
		}
		
		s += "</table>";
		$("#crdTable").html(s);
		$("#crdList").show();
	}
	
	//
	// Reset the PCD fields
	//
	function clearPCD() {
		resetField($("#fldPcdDia"), "0");
		resetField($("#fldPcdNum"), "0");
		resetField($("#fldPcdAng"), "0");
		resetField($("#fldPcdSize"), "0");
		resetField($("#fldPcdCtr"), "");
		resetField($("#fldPcdCheck"), "");
		$("#crdList").hide();
		$("#crdTable").empty();
	}
	
	//
	// Parse sine bar dimensions
	//
	function parseSine() {
		len1 = parseField($("#fldSinLen"), "length", 0, -1);
		if (isNaN(len1)) {
			return false;
		}

		len2 = parseField($("#fldSinHgt"), "height", 0, -1);
		if (isNaN(len2)) {
			return false;
		}

		angle1 = parseField($("#fldSinAng"), "angle", 0, 90);
		if (isNaN(angle1)) {
			return false;
		}

		return true;
	}
	
	//
	// Calculate sine bar dimensions
	//
	function calculateSine() {
		if (!parseSine())
			return;
		
		if (len1 == 0) {
			if ((len2 == 0) || (angle1 == 0)) {
				showAlert("Please supply two values");
				return;
			}
			len1 = len2 / Math.sin((Math.PI / 180) * angle1);
		}
		else {
			if (len2 != 0) {
				angle1 = Math.asin(len2 / len1) * 180 / Math.PI;
			}
			else if (angle1 != 0) {
				len2 = len1 * Math.sin((Math.PI / 180) * angle1);
			}
			else {
				showAlert("Please supply two values");
				return;
			}
		}

		// Display the results
		showValue($("#fldSinLen"), len1);
		showValue($("#fldSinHgt"), len2);
		showValue($("#fldSinAng"), angle1);
	}
	
	//
	// Reset the sine bar fields
	//
	function clearSine() {
		resetField($("#fldSinLen"), "0");
		resetField($("#fldSinHgt"), "0");
		resetField($("#fldSinAng"), "0");
	}
	
	//
	// Dispatch to the relevant calculator
	//
	function calculateForm() {
		var typ = $('input[name=fldType]:checked', '#frmGeometry').val();

		switch (typ) {
			case "polygon": calculatePolygon();
				break;
			case "circle": calculateCircle();
				break;
			case "triangle": calculateTriangle();
				break;
			case "rectangle": calculateRectangle();
				break;
			case "pcd": calculatePCD();
				break;
			case "sine": calculateSine();
				break;
		}
	}
	
	//
	// Clear all fields on the "forms"
	//
	function clearForm() {
		var typ = $('input[name=fldType]:checked', '#frmGeometry').val();

		switch (typ) {
			case "polygon": clearPolygon();
				break;
			case "circle": clearCircle();
				break;
			case "triangle": clearTriangle();
				break;
			case "rectangle": clearRectangle();
				break;
			case "pcd": clearPCD();
				break;
			case "sine": clearSine();
				break;
		}
	}
	
	//
	// Show the help form
	//
	function helpForm() {
		$("#mainForm").hide();
		$("#helpForm").show();
	}
	
	//
	// Go back to the main form
	//
	function backForm() {
		$("#helpForm").hide();
		$("#mainForm").show();
	}
	
	return {
		init: initialise
	}
})();
