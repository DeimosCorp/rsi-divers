window.DEIM_skuWatcher = {
	timeout: null,
	watchShipId: null,
	
	autoAddToCartShipSkuByShipId: function(shipId)
	{
		if (DEIM_skuWatcher.watchShipId===null && shipId!==null) {
			var detectedShipInfo = DEIM_skuWatcher.detectShipFromShipStatsApp();
			if(detectedShipInfo.id===null) {
				var msgErr = "Cannot auto-detect a specific ship on this page";
				DEIM_skuWatcher.sayTTS("Error: "+msgErr, 'en-US');
				console.error(msgErr, detectedShipInfo);
				console.error('Try manually if you know the ship id', 'DEIM_skuWatcher.autoAddToCartShipSkuByShipId( shipId );');
			} else {
				DEIM_skuWatcher.sayTTS("Script Initialized, now watching: "+detectedShipInfo.name, 'en-US');
				shipId = detectedShipInfo.id;
			}
		}

		DEIM_skuWatcher.watchShipId = shipId;
		if(DEIM_skuWatcher.timeout!==null){
			clearTimeout(DEIM_skuWatcher.timeout);
		}
		DEIM_skuWatcher.timeout = setTimeout(function(){
			DEIM_skuWatcher.addToCartShipSkuByShipId(DEIM_skuWatcher.watchShipId);
			DEIM_skuWatcher.autoAddToCartShipSkuByShipId(DEIM_skuWatcher.watchShipId);
		}, Math.floor(Math.random()*1000)+2000 );
	},

	addToCartShipSkuByShipId: function(shipId)
	{
		RSI.Api.Store.getShipSuggestedSKU(function(r){
			try
			{
				var txt = "";
				if(r.success && r.code === "OK"){
					DEIM_skuWatcher.sayTTS("Disponible: "+r.data.sku_title, 'fr-FR');
				}
				else if(!r.success && r.code==="ErrShipSKUNotAvailable"){
					//DEIM_skuWatcher.sayTTS("Non Disponible", 'fr-FR');
				}

				if(r.success && r.code === "OK"){
					var sku = {};
					sku[r.data.sku_id] = 1; //quantity
					Ty.Api.Store.addToCart(Page.bindMethod(Page.onAddToCart,Page),{"skus":sku});
				}
		    }
			catch(er) {
				console.error("DEIM getShipSuggestedSKU failed");
			}

		}, {storefront:"pledge", ship_id:shipId});
	},

	sayTTS: function(messageText, locale)
	{
		try {
			var msg = new SpeechSynthesisUtterance(""+messageText);
			msg.volume=1;
			if(typeof locale == "undefined") {
				var locale = 'fr-FR';
			}
			msg.lang = locale;
			console.info("DEIM Notice", ""+messageText, locale);
			window.speechSynthesis.speak(msg);
		} catch(err) {
			console.warn("speechSynthesis unavailable", err);
		}
	},

	detectShipFromShipStatsApp: function()
	{
		var resultShip = {name:"",id:null};

		window.RSI = typeof window.RSI === 'undefined' ? {} : window.RSI;
		window.RSI.ShipStatsApp = typeof window.RSI.ShipStatsApp === 'undefined' ? {} : window.RSI.ShipStatsApp;
		window.RSI.ShipStatsApp.app = typeof window.RSI.ShipStatsApp.app === 'undefined' ? {} : window.RSI.ShipStatsApp.app;
		window.RSI.ShipStatsApp.app.current_ship = typeof window.RSI.ShipStatsApp.app.current_ship === 'undefined' ? {} : window.RSI.ShipStatsApp.app.current_ship;
		window.RSI.ShipStatsApp.app.current_ship.attributes = typeof window.RSI.ShipStatsApp.app.current_ship.attributes === 'undefined' ? {} : window.RSI.ShipStatsApp.app.current_ship.attributes;

		resultShip.name = typeof window.RSI.ShipStatsApp.app.current_ship.attributes.name==='undefined'? '' : window.RSI.ShipStatsApp.app.current_ship.attributes.name;
		resultShip.id = typeof window.RSI.ShipStatsApp.app.current_ship.attributes.id==='undefined'? '' : window.RSI.ShipStatsApp.app.current_ship.attributes.id;
		if(resultShip.id===""){
			resultShip.id = null;
		}

		return resultShip;
	}

};

// ship id can be found on a ship page view full: ex: https://robertsspaceindustries.com/pledge/ships/aegis-javelin/Javelin-Class-Destroyer
// RSI.ShipStatsApp.app.current_id = 63
// RSI.ShipStatsApp.app.current_ship.id = 63
// RSI.ShipStatsApp.app.current_ship.attributes.id = 63
// RSI.ShipStatsApp.app.current_ship.attributes.name
DEIM_skuWatcher.autoAddToCartShipSkuByShipId();

