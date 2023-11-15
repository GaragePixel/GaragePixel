// ============================================================================
// AddBayerMTX - Adobe Photoshop Script
// ============================================================================
// Description: Create/restore the Bayer Patterns 2x2/4x4/8x8 in the Library
// Requirements: Adobe Photoshop CS2, or higher
// Author: iDkP for GaragePixel (https://www.facebook.com/GaragePixelOfficial/)
// Website: https://www.facebook.com/GaragePixelOfficial/ <-- Please follow!
// ============================================================================
// Version: 0.0.1, 2022-03-16 [Internal usage]
// Version: 1.0.0, 2023-09-26 [First public release]
// Version: 1.0.1, 2023-09-27 [Add conditional pattern making]
// Version: 1.0.2, 2023-11-15 [Global revision]
// ============================================================================
// Usage: Just run^^
// Notes: This script is a part of a *maybe* future library 
// with some minor but included dependencies.
// The dot method is original from the author. 
// It puts a single pixel from a selection. 
// After testing many solution, this technique is the fastest for this task.
// ============================================================================
// Installation:
// 1. Place script in 'C:\Program Files\Adobe\Adobe Photoshop CC ####\Presets\Scripts\'
// 2. Restart Photoshop
// 3. Choose File > Scripts > Create the Bayer Pattern 2x2/4x4/8x8 in the Library
// ============================================================================
// Portable usage:
// 1. File > Scripts > Browse
// 2. Find your copy
// 3. Enjoy^^
// ============================================================================
// Todo: I will add other important patterns in the future
// ============================================================================

#target photoshop

function addBayerMtxToPresetManager() {

    // --------------------------------------------------------------------------------
    // This Lib's related functions
    // --------------------------------------------------------------------------------
	
    function addBayerMtx(patternName) {

        var oldRulerUnits = app.preferences.rulerUnits
        var oldTypeUnits = app.preferences.typeUnits
        var oldDisplayDialogs = app.displayDialogs        
        app.preferences.rulerUnits = Units.PIXELS;
        app.preferences.typeUnits = TypeUnits.PIXELS;
        app.displayDialogs = DialogModes.NO;    
        
        var checkersDoc;
        var doc;

        switch (patternName) {
            case "Bayer2x2":
        	checkersDoc = app.documents.add(2, 2, 72, "DitherMtx");        
	        doc = app.activeDocument;
        	drawBayer2x2(doc,0,0);    
        	doc.selection.select([[0, 0],[2, 0],[2, 2],[0, 2],[0, 0]], SelectionType.EXTEND);    
        	definePattern( patternName )
                break;
            case "Bayer4x4":			
        	checkersDoc = app.documents.add(4, 4, 72, "DitherMtx");        
	        doc = app.activeDocument;
        	drawBayer4x4(doc,0,0);    
        	doc.selection.select([[0, 0],[4, 0],[4, 4],[0, 4],[0, 0]], SelectionType.EXTEND);    
        	definePattern( patternName )
                break;
            case "Bayer8x8":
        	checkersDoc = app.documents.add(8, 8, 72, "DitherMtx");        
	        doc = app.activeDocument;
        	drawBayer8x8(doc,0,0);    
        	doc.selection.select([[0, 0],[8, 0],[8, 8],[0, 8],[0, 0]], SelectionType.EXTEND);    
        	definePattern( patternName )
                break; // I will add other important patterns in the future
        }
        
        doc.close(SaveOptions.DONOTSAVECHANGES)
        
        app.preferences.rulerUnits = oldRulerUnits
        app.preferences.typeUnits = oldTypeUnits
        app.displayDialogs = oldDisplayDialogs
    }

    function addInLibIfNotExist(patternName) {
        if (!hasPattern(patternName)) {addBayerMtx(patternName)}
    }

    function dot(doc,x,y,c) { // c is a SolidColor      
        // self work
        doc.selection.select([[x, y],[x + 1, y],[x + 1, y + 1],[x, y + 1],[x, y]], SelectionType.REPLACE);
        doc.selection.fill(c)
    }

    function GREY(v) {
        var c = new SolidColor();
        c.rgb.red = v;
        c.rgb.green = v;
        c.rgb.blue = v;
        return c    
    }
	
    // --------------------------------------------------------------------------------
    // Photoshop's related functions
    // --------------------------------------------------------------------------------
	
    function hasPattern(patternName) {
	var result;
	try {
		var ref = new ActionReference();
		ref.putProperty(stringIDToTypeID ("property"), stringIDToTypeID("presetManager")); 
		ref.putEnumerated(charIDToTypeID("capp"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
		var applicationDesc = executeActionGet(ref);
		var presetManager = applicationDesc.getList(stringIDToTypeID("presetManager"));
		var patternNames = presetManager.getObjectValue(4).getList(stringIDToTypeID("name"));
		var theNames = new Array;
		for (m = 0; m < patternNames.count; m++) {
		    theNames.push(patternNames.getString(m))
		}
		for (i = 0; i < theNames.length; i++) {
		    if (theNames[i] == patternName) {
		    	result = true;
			break
		    }		
		} 
	} catch (e) {}
	return result
    }

    function definePattern(patternName) {
        var c2t = function(s) {return app.charIDToTypeID(s);};
        var doc = app.activeDocument;
        var desc6 = new ActionDescriptor();
        var ref3 = new ActionReference();
        ref3.putClass(c2t("Ptrn"));
        desc6.putReference(c2t("null"),ref3);
        var ref4 = new ActionReference();
        ref4.putProperty(c2t("Prpr"),c2t("fsel"));
        ref4.putEnumerated(c2t("dcmn"),c2t("Ordn"),c2t("Trgt"));
        desc6.putReference(c2t("Usng"),ref4);
        desc6.putString(c2t("Nm  "),patternName);
        executeAction(c2t("Mk  "),desc6,DialogModes.NO);
    }    

    // --------------------------------------------------------------------------------
    // Create/recreate the "halftone-like square pattern" (as Adobe saids)
    // More explicitly, the Bayer-method ordered dither.
    // --------------------------------------------------------------------------------
	
    function drawBayer2x2(doc,x,y) {
        var d=255.0/3;
        dot(doc,x+0,y+0,GREY(0));     dot(doc,x+1,y+0,GREY(2*d));
        dot(doc,x+0,y+1,GREY(3*d));   dot(doc,x+1,y+1,GREY(85));
    }

    function drawBayer4x4(doc,x,y) {
        var d=17;
        dot(doc,x+0,y+0,GREY(0));     dot(doc,x+1,y+0,GREY(8*d));    dot(doc,x+2,y+0,GREY(2*d));     dot(doc,x+3,y+0,GREY(10*d));
        dot(doc,x+0,y+1,GREY(12*d));  dot(doc,x+1,y+1,GREY(4*d));    dot(doc,x+2,y+1,GREY(14*d));    dot(doc,x+3,y+1,GREY(6*d));
        dot(doc,x+0,y+2,GREY(3*d));   dot(doc,x+1,y+2,GREY(11*d));   dot(doc,x+2,y+2,GREY(1*d));     dot(doc,x+3,y+2,GREY(9*d));
        dot(doc,x+0,y+3,GREY(255));   dot(doc,x+1,y+3,GREY(7*d));    dot(doc,x+2,y+3,GREY(13*d));    dot(doc,x+3,y+3,GREY(5*d));
    }

    function drawBayer8x8(doc,x,y) {
        var d=255.0/63; // 4.04761
        dot(doc,x+0,y+0,GREY(0));    	     dot(doc,x+1,y+0,GREY(INT(32.0*d))); dot(doc,x+2,y+0,GREY(INT( 8.0*d)));   dot(doc,x+3,y+0,GREY(INT(40.0*d)));    dot(doc,x+4,y+0,GREY(INT( 2.0*d)));  dot(doc,x+5,y+0,GREY(INT(34.0*d)));	dot(doc,x+6,y+0,GREY(INT(10.0*d)));   dot(doc,x+7,y+0,GREY(INT(42.0*d)));
        dot(doc,x+0,y+1,GREY(INT(48.0*d)));  dot(doc,x+1,y+1,GREY(INT(16.0*d))); dot(doc,x+2,y+1,GREY(INT(56.0*d)));   dot(doc,x+3,y+1,GREY(INT(24.0*d)));    dot(doc,x+4,y+1,GREY(INT(50.0*d)));  dot(doc,x+5,y+1,GREY(INT(18.0*d)));	dot(doc,x+6,y+1,GREY(INT(58.0*d)));   dot(doc,x+7,y+1,GREY(INT(26.0*d)));    
        dot(doc,x+0,y+2,GREY(INT(12.0*d)));  dot(doc,x+1,y+2,GREY(INT(44.0*d))); dot(doc,x+2,y+2,GREY(INT( 4.0*d)));   dot(doc,x+3,y+2,GREY(INT(36.0*d)));    dot(doc,x+4,y+2,GREY(INT(14.0*d)));  dot(doc,x+5,y+2,GREY(INT(46.0*d)));	dot(doc,x+6,y+2,GREY(INT( 6.0*d)));   dot(doc,x+7,y+2,GREY(INT(38.0*d)));
        dot(doc,x+0,y+3,GREY(INT(60.0*d)));  dot(doc,x+1,y+3,GREY(INT(28.0*d))); dot(doc,x+2,y+3,GREY(INT(52.0*d)));   dot(doc,x+3,y+3,GREY(INT(20.0*d)));    dot(doc,x+4,y+3,GREY(INT(62.0*d)));  dot(doc,x+5,y+3,GREY(INT(30.0*d)));	dot(doc,x+6,y+3,GREY(INT(54.0*d)));   dot(doc,x+7,y+3,GREY(INT(22.0*d)));
        dot(doc,x+0,y+4,GREY(INT( 3.0*d)));  dot(doc,x+1,y+4,GREY(INT(35.0*d))); dot(doc,x+2,y+4,GREY(INT(11.0*d)));   dot(doc,x+3,y+4,GREY(INT(43.0*d)));    dot(doc,x+4,y+4,GREY(INT( 1.0*d)));  dot(doc,x+5,y+4,GREY(INT(33.0*d)));	dot(doc,x+6,y+4,GREY(INT( 9.0*d)));   dot(doc,x+7,y+4,GREY(INT(41.0*d)));
        dot(doc,x+0,y+5,GREY(INT(51.0*d)));  dot(doc,x+1,y+5,GREY(INT(19.0*d))); dot(doc,x+2,y+5,GREY(INT(59.0*d)));   dot(doc,x+3,y+5,GREY(INT(27.0*d)));    dot(doc,x+4,y+5,GREY(INT(49.0*d)));  dot(doc,x+5,y+5,GREY(INT(17.0*d)));	dot(doc,x+6,y+5,GREY(INT(57.0*d)));   dot(doc,x+7,y+5,GREY(INT(25.0*d)));
        dot(doc,x+0,y+6,GREY(INT(15.0*d)));  dot(doc,x+1,y+6,GREY(INT(47.0*d))); dot(doc,x+2,y+6,GREY(INT( 7.0*d)));   dot(doc,x+3,y+6,GREY(INT(39.0*d)));    dot(doc,x+4,y+6,GREY(INT(13.0*d)));  dot(doc,x+5,y+6,GREY(INT(45.0*d)));	dot(doc,x+6,y+6,GREY(INT( 5.0*d)));   dot(doc,x+7,y+6,GREY(INT(37.0*d)));
        dot(doc,x+0,y+7,GREY(255));   	     dot(doc,x+1,y+7,GREY(INT(31.0*d))); dot(doc,x+2,y+7,GREY(INT(55.0*d)));   dot(doc,x+3,y+7,GREY(INT(23.0*d)));    dot(doc,x+4,y+7,GREY(INT(61.0*d)));  dot(doc,x+5,y+7,GREY(INT(29.0*d)));	dot(doc,x+6,y+7,GREY(INT(53.0*d)));   dot(doc,x+7,y+7,GREY(INT(21.0*d)));
	function INT(f) {return Math.floor(f)}
    }

    // --------------------------------------------------------------------------------
    // MAIN
    // --------------------------------------------------------------------------------
	
    function main() {
	addInLibIfNotExist("Bayer2x2")
	addInLibIfNotExist("Bayer4x4")
	addInLibIfNotExist("Bayer8x8")
    }

    app.activeDocument.suspendHistory("Recreate Bayer's pattern","main()")

}

addBayerMtxToPresetManager()
