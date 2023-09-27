// ============================================================================
// AddBayerMTX - Adobe Photoshop Script
// ============================================================================
// Description: Create the Bayer Pattern 2x2/4x4/8x8 in the Library
// Requirements: Adobe Photoshop CS2, or higher
// Author: iDkP for GaragePixel (https://www.facebook.com/GaragePixelOfficial/)
// Website: https://www.facebook.com/GaragePixelOfficial/ <-- Please follow!
// ============================================================================
// Version: 0.0.1, 2022-03-16 [Internal usage]
// Version: 1.0.0, 2023-09-26 [First public release]
// Version: 1.0.1, 2022-09-27 [Add conditional pattern making]
// ============================================================================
// Usage: Just run^^
// Notes: This script is a part of a library with some minor but included dependencies.
// The plot method is original from the author. 
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
// Todo: The script creates only the missing patterns [Done]
// ============================================================================

#target photoshop

function addBayerMtxToPresetManager() {

    function addBayerMtx(bayerType) {
        // --------------------------------------------------------------------------------
        // Create/recreate our beloved "halftone-like square pattern" (as Adobe saids)
        // and store it as a pattern called Bayer2x2, Bayer4x4 or Bayer8x8
        // --------------------------------------------------------------------------------
        var oldRulerUnits = app.preferences.rulerUnits
        var oldTypeUnits = app.preferences.typeUnits
        var oldDisplayDialogs = app.displayDialogs
        
        app.preferences.rulerUnits = Units.PIXELS;
        app.preferences.typeUnits = TypeUnits.PIXELS;
        app.displayDialogs = DialogModes.NO;    
        
        var checkersDoc;
        var doc;
        
	if (bayerType == "Bayer2x2") {
        	checkersDoc = app.documents.add(2, 2, 72, "DitherMtx");        
	        doc = app.activeDocument;
        	drawBayerMtx2x2(doc,0,0);    
        	doc.selection.select([[0, 0],[2, 0],[2, 2],[0, 2],[0, 0]], SelectionType.EXTEND);    
        	definePattern( "Bayer2x2" )
	}else if (bayerType == "Bayer8x8") {
        	checkersDoc = app.documents.add(8, 8, 72, "DitherMtx");        
	        doc = app.activeDocument;
        	drawBayerMtx8x8(doc,0,0);    
        	doc.selection.select([[0, 0],[8, 0],[8, 8],[0, 8],[0, 0]], SelectionType.EXTEND);    
        	definePattern( "Bayer8x8" )
	}else{
        	checkersDoc = app.documents.add(4, 4, 72, "DitherMtx");        
	        doc = app.activeDocument;
        	drawBayerMtx4x4(doc,0,0);    
        	doc.selection.select([[0, 0],[4, 0],[4, 4],[0, 4],[0, 0]], SelectionType.EXTEND);    
        	definePattern( "Bayer4x4" )
	}
        
        doc.close(SaveOptions.DONOTSAVECHANGES)
        
        app.preferences.rulerUnits = oldRulerUnits
        app.preferences.typeUnits = oldTypeUnits
        app.displayDialogs = oldDisplayDialogs
    }

    function addInLibPatternIfNotExist(patternName) {
        switch (patternName) {
            case "Bayer2x2":
                addBayer2x2ifNotExist()
                break;
            case "Bayer4x4":
                addBayer4x4ifNotExist()
                break;
            case "Bayer8x8":
                addBayer8x8ifNotExist()
                break;
        }      
    }

    function addBayer2x2ifNotExist() {        
        if (!hasPattern("Bayer2x2")) {
            addBayerMtx("Bayer2x2")
        }
    }

    function addBayer4x4ifNotExist() {        
        if (!hasPattern("Bayer4x4")) {
            addBayerMtx("Bayer4x4")
        }
    }

    function addBayer8x8ifNotExist() {        
        if (!hasPattern("Bayer8x8")) {
            addBayerMtx("Bayer8x8")
        }
    }

    function hasPattern(thisPatternName) {
	var result;
	try {
		var ref = new ActionReference();
		ref.putProperty(stringIDToTypeID ("property"), stringIDToTypeID("presetManager") ); 
		ref.putEnumerated( charIDToTypeID("capp"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
		var applicationDesc = executeActionGet(ref);
		var presetManager = applicationDesc.getList(stringIDToTypeID("presetManager"));
		var patternNames = presetManager.getObjectValue(4).getList(stringIDToTypeID("name"));
		var theNames = new Array;
		for (m = 0; m < patternNames.count; m++) {
		    theNames.push(patternNames.getString(m))
		}
		for (i = 0; i < theNames.length; i++) {
		    if (theNames[i] == thisPatternName) {
		    	result = true;
			break
		    }		
		} 
	} catch (e) {}
	return result
    }

    function definePattern(patternName) {
        var c2t = function (s) {return app.charIDToTypeID(s);};
        var doc = app.activeDocument;
        var desc6 = new ActionDescriptor();
        var ref3 = new ActionReference();
        ref3.putClass( c2t( "Ptrn" ) );
        desc6.putReference( c2t( "null" ), ref3 );
        var ref4 = new ActionReference();
        ref4.putProperty( c2t( "Prpr" ), c2t( "fsel" ) );
        ref4.putEnumerated( c2t( "dcmn" ), c2t( "Ordn" ), c2t( "Trgt" ) );
        desc6.putReference( c2t( "Usng" ), ref4 );
        desc6.putString( c2t( "Nm  "), patternName );
        executeAction ( c2t( "Mk  " ), desc6, DialogModes.NO );
    }    

    function drawBayerMtx2x2(doc,x,y) {
        var d=255.0/3;
        plotPixel(doc,x+0,y+0,GREY(0));     plotPixel(doc,x+1,y+0,GREY(2*d));
        plotPixel(doc,x+0,y+1,GREY(3*d));   plotPixel(doc,x+1,y+1,GREY(85));
    }

    function drawBayerMtx4x4(doc,x,y) {
        var d=17;
        plotPixel(doc,x+0,y+0,GREY(0));     plotPixel(doc,x+1,y+0,GREY(8*d));    plotPixel(doc,x+2,y+0,GREY(2*d));     plotPixel(doc,x+3,y+0,GREY(10*d));
        plotPixel(doc,x+0,y+1,GREY(12*d));  plotPixel(doc,x+1,y+1,GREY(4*d));    plotPixel(doc,x+2,y+1,GREY(14*d));    plotPixel(doc,x+3,y+1,GREY(6*d));
        plotPixel(doc,x+0,y+2,GREY(3*d));   plotPixel(doc,x+1,y+2,GREY(11*d));   plotPixel(doc,x+2,y+2,GREY(1*d));     plotPixel(doc,x+3,y+2,GREY(9*d));
        plotPixel(doc,x+0,y+3,GREY(255));   plotPixel(doc,x+1,y+3,GREY(7*d));    plotPixel(doc,x+2,y+3,GREY(13*d));    plotPixel(doc,x+3,y+3,GREY(5*d));
    }

    function drawBayerMtx8x8(doc,x,y) {
        var d=255.0/63; // 4.04761
        plotPixel(doc,x+0,y+0,GREY(0));    		   plotPixel(doc,x+1,y+0,GREY(Math.floor(32.0*d))); plotPixel(doc,x+2,y+0,GREY(Math.floor(8.0*d)));    plotPixel(doc,x+3,y+0,GREY(Math.floor(40.0*d)));    plotPixel(doc,x+4,y+0,GREY(Math.floor(2.0*d)));plotPixel(doc,x+5,y+0,GREY(Math.floor(34.0*d)));plotPixel(doc,x+6,y+0,GREY(Math.floor(10.0*d)));   plotPixel(doc,x+7,y+0,GREY(Math.floor(42.0*d)));
        plotPixel(doc,x+0,y+1,GREY(Math.floor(48.0*d)));   plotPixel(doc,x+1,y+1,GREY(Math.floor(16.0*d))); plotPixel(doc,x+2,y+1,GREY(Math.floor(56.0*d)));   plotPixel(doc,x+3,y+1,GREY(Math.floor(24.0*d)));    plotPixel(doc,x+4,y+1,GREY(Math.floor(50.0*d)));plotPixel(doc,x+5,y+1,GREY(Math.floor(18.0*d)));plotPixel(doc,x+6,y+1,GREY(Math.floor(58.0*d)));   plotPixel(doc,x+7,y+1,GREY(Math.floor(26.0*d)));    
        plotPixel(doc,x+0,y+2,GREY(Math.floor(12.0*d)));   plotPixel(doc,x+1,y+2,GREY(Math.floor(44.0*d))); plotPixel(doc,x+2,y+2,GREY(Math.floor(4.0*d)));    plotPixel(doc,x+3,y+2,GREY(Math.floor(36.0*d)));    plotPixel(doc,x+4,y+2,GREY(Math.floor(14.0*d)));plotPixel(doc,x+5,y+2,GREY(Math.floor(46.0*d)));plotPixel(doc,x+6,y+2,GREY(Math.floor(6.0*d)));     plotPixel(doc,x+7,y+2,GREY(Math.floor(38.0*d)));
        plotPixel(doc,x+0,y+3,GREY(Math.floor(60.0*d)));   plotPixel(doc,x+1,y+3,GREY(Math.floor(28.0*d))); plotPixel(doc,x+2,y+3,GREY(Math.floor(52.0*d)));   plotPixel(doc,x+3,y+3,GREY(Math.floor(20.0*d)));    plotPixel(doc,x+4,y+3,GREY(Math.floor(62.0*d)));plotPixel(doc,x+5,y+3,GREY(Math.floor(30.0*d)));plotPixel(doc,x+6,y+3,GREY(Math.floor(54.0*d)));   plotPixel(doc,x+7,y+3,GREY(Math.floor(22.0*d)));
        plotPixel(doc,x+0,y+4,GREY(Math.floor(3.0*d)));    plotPixel(doc,x+1,y+4,GREY(Math.floor(35.0*d))); plotPixel(doc,x+2,y+4,GREY(Math.floor(11.0*d)));   plotPixel(doc,x+3,y+4,GREY(Math.floor(43.0*d)));    plotPixel(doc,x+4,y+4,GREY(Math.floor(1.0*d)));plotPixel(doc,x+5,y+4,GREY(Math.floor(33.0*d)));plotPixel(doc,x+6,y+4,GREY(Math.floor(9.0*d)));     plotPixel(doc,x+7,y+4,GREY(Math.floor(41.0*d)));
        plotPixel(doc,x+0,y+5,GREY(Math.floor(51.0*d)));   plotPixel(doc,x+1,y+5,GREY(Math.floor(19.0*d))); plotPixel(doc,x+2,y+5,GREY(Math.floor(59.0*d)));   plotPixel(doc,x+3,y+5,GREY(Math.floor(27.0*d)));    plotPixel(doc,x+4,y+5,GREY(Math.floor(49.0*d)));plotPixel(doc,x+5,y+5,GREY(Math.floor(17.0*d)));plotPixel(doc,x+6,y+5,GREY(Math.floor(57.0*d)));   plotPixel(doc,x+7,y+5,GREY(Math.floor(25.0*d)));
        plotPixel(doc,x+0,y+6,GREY(Math.floor(15.0*d)));   plotPixel(doc,x+1,y+6,GREY(Math.floor(47.0*d))); plotPixel(doc,x+2,y+6,GREY(Math.floor(7.0*d)));    plotPixel(doc,x+3,y+6,GREY(Math.floor(39.0*d)));    plotPixel(doc,x+4,y+6,GREY(Math.floor(13.0*d)));plotPixel(doc,x+5,y+6,GREY(Math.floor(45.0*d)));plotPixel(doc,x+6,y+6,GREY(Math.floor(5.0*d)));     plotPixel(doc,x+7,y+6,GREY(Math.floor(37.0*d)));
        plotPixel(doc,x+0,y+7,GREY(255));   		   plotPixel(doc,x+1,y+7,GREY(Math.floor(31.0*d))); plotPixel(doc,x+2,y+7,GREY(Math.floor(55.0*d)));   plotPixel(doc,x+3,y+7,GREY(Math.floor(23.0*d)));    plotPixel(doc,x+4,y+7,GREY(Math.floor(61.0*d)));plotPixel(doc,x+5,y+7,GREY(Math.floor(29.0*d)));plotPixel(doc,x+6,y+7,GREY(Math.floor(53.0*d)));   plotPixel(doc,x+7,y+7,GREY(Math.floor(21.0*d)));
    }

    function plotPixel(doc,x,y,c) { // c is a SolidColor      
        // self work
        doc.selection.select([[x, y],[x + 1, y],[x + 1, y + 1],[x, y + 1],[x, y]], SelectionType.REPLACE);
        doc.selection.fill(c);    
    }

    function GREY(v) {
        // self work
        var c = new SolidColor();
        c.rgb.red = v;
        c.rgb.green = v;
        c.rgb.blue = v;
        return c    
    }

    function main() {
	addInLibPatternIfNotExist("Bayer2x2")
	addInLibPatternIfNotExist("Bayer4x4")
	addInLibPatternIfNotExist("Bayer8x8")
    }

    app.activeDocument.suspendHistory("Recreate Bayer's pattern","main()")

}

addBayerMtxToPresetManager()
