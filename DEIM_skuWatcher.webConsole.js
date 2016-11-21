window.DEIM_skuWatcher = {
	timeout: null,
	watchShipId: null,
	
	autoAddToCartShipSkuByShipId: function(shipId){
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
		// www.deim.fr
		RSI.Api.Store.getShipSuggestedSKU(function(r){
			try
			{
				try {
					var msg = new SpeechSynthesisUtterance("");
					msg.lang = "fr-FR";
					if(r.success && r.code === "OK"){
						msg.text = "Disponible: "+r.data.sku_title;
					}
					else if(!r.success && r.code==="ErrShipSKUNotAvailable"){
						//msg.text = "Non disponible";
					}
					msg.volume=1;
				    window.speechSynthesis.speak(msg);
				}
				catch(err) {
				    console.warn("speechSynthesis unavailable");
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
	}

};

// ship id can be found on a ship page view full: ex: https://robertsspaceindustries.com/pledge/ships/aegis-javelin/Javelin-Class-Destroyer
// RSI.ShipStatsApp.app.current_id = 63
DEIM_skuWatcher.autoAddToCartShipSkuByShipId(RSI.ShipStatsApp.app.current_id);

