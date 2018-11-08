// 自定义分辨率和瓦片坐标系
var resolutions = [];
var maxZoom = 18;

// 计算百度使用的分辨率
for(var i=0; i<=maxZoom; i++){
    resolutions[i] = Math.pow(2, maxZoom-i);
}
var tilegrid = new ol.tilegrid.TileGrid({
    origin: [0, 0],           // 设置原点坐标
    resolutions: resolutions  // 设置分辨率
});

// Open Street Map 地图层
var openStreetMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Bing地图层
var bingMapLayer = new ol.layer.Tile({
    source: new ol.source.BingMaps({
        key: 'AkjzA7OhS4MIBjutL21bkAop7dc41HSE0CNTR5c6HJy8JKc7U9U9RveWJrylD3XJ',
        imagerySet: 'Road'
    })
});

// Stamen地图层
var stamenLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'watercolor'
    })
});

// MapQuest地图层
var mapQuestLayer = new ol.layer.Tile({
    source: new ol.source.MapQuest({
        layer: 'osm'
    })
});

// 万能瓦片地图：Open Street Map
var openStreetMapXYZLayerMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
});

// 万能瓦片地图：高德地图
var AMapXYZLayerMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
    })
});

// 万能瓦片地图：Yahoo地图
var YahooXYZLayerMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:'https://{0-3}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?lg=ENG&ppi=250&token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B'
    })
});

// 万能瓦片地图：百度地图
var baiduSource = new ol.source.TileImage({
    projection: 'EPSG:3857',
    tileGrid: tilegrid,
    tileUrlFunction: function(tileCoord, pixelRatio, proj){
        var z = tileCoord[0];
        var x = tileCoord[1];
        var y = tileCoord[2];

        // 百度瓦片服务url将负数使用M前缀来标识
        if(x < 0){
            x = 'M' + (-x);
        }

        if(y < 0){
            y = 'M' + (-y);
        }

        return "http://online0.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20160426&scaler=1&p=0";
    }
});
var BaiduXYZLayerMap = new ol.layer.Tile({
    source: baiduSource
});

// 万能瓦片地图：Bing地图
var BingMapLayerXYZMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        tileUrlFunction: function(tileCoord){
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = -tileCoord[2] - 1;
            var result = "", zIndex = 0;
            for(; zIndex<z; zIndex++){
                result = ((x&1)+2*(y&1)).toString() + result;
                x >>= 1;
                y >>= 1;
            }
            return 'http://dynamic.t0.tiles.ditu.live.com/comp/ch/' + result + '?it=G,VE,BX,L,LA&mkt=zh-cn,syr&n=z&og=111&ur=CN';
        }
    })
});

// 万能瓦片地图：google地图
var GoogleMapLayerXYZMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
    })
});

// 离线加载瓦片地图
var OfflineMapLayerMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'src/05-04/offlineMapTiles/{z}/{x}/{y}.png'
    })
});

// 创建地图
var center = ol.proj.transform([104.06667, 30.66667], 'EPSG:4326', 'EPSG:3857');
var map = new ol.Map({   
    controls: ol.control.defaults({
        attributionOptions: ({
            collapsible: false
        })
    }),
    logo: {src: 'src/img/face_monkey.png', href: 'http://www.openstreetmap.org/'},
    layers: [           
        openStreetMapLayer 
    ],
    view: new ol.View({
        // 设置成都为地图中心，此处进行坐标转换
        center: center,
        zoom: 4
        // 限制地图缩放最大级别为14，最小级别为10
        // minZoom: 4,
        // maxZoom: 14
    }),
    target: 'map'                    
});

// 向左移动地图
function moveToLeft(){
    var view = map.getView();
    var mapCenter = view.getCenter();
    // 让地图中心的x值增加，即可使得地图向左移动，增加的值根据效果可自由设定
    mapCenter[0] += 50000;
    view.setCenter(mapCenter);
    map.render();
}

// 向右移动地图
function moveToRight(){
    var view = map.getView();
    var mapCenter = view.getCenter();
    // 让地图中心的x值减少，即可使得地图向右移动，减少的值根据效果可自由设定
    mapCenter[0] -= 50000;
    view.setCenter(mapCenter);
    map.render();
}

// 向上移动地图
function moveToUp(){
    var view = map.getView();
    var mapCenter = view.getCenter();
    // 让地图中心的y值减少，即可使得地图向上移动，减少的值根据效果可自由设定
    mapCenter[1] -= 50000;
    view.setCenter(mapCenter);
    map.render();
}

// 向下移动地图
function moveToDown(){
    var view = map.getView();
    var mapCenter = view.getCenter();
    // 让地图中心的y值增加，即可使得地图向上移动，减少的值根据效果可自由设定
    mapCenter[1] += 50000;
    view.setCenter(mapCenter);
    map.render();
}

// 移动到成都
function moveToChengDu(){
    var view = map.getView();
    // 设置地图中心为成都的坐标，即可让地图移动到成都
    view.setCenter(ol.proj.transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857'));
    map.render();
}

// 放大地图
function zoomIn(){
    var view = map.getView();
    // 让地图的zoom增加1，从而实现地图放大
    view.setZoom(view.getZoom() + 1);
}

// 缩小地图
function zoomOut(){
    var view = map.getView();
    // 让地图的zoom减小1，从而实现地图缩小
    view.setZoom(view.getZoom() - 1);
}

// 显示成都
function fitToChengdu(){
    var extent = [102, 29, 104, 31];
    var imgW = extent[2];
    var imgH = extent[3];
    var boxW = document.getElementById('map').offsetWidth;
    var boxH = document.getElementById('map').offsetHeight;
    var xRes = imgW / boxW;
    var yRes = imgH / boxH;
    var maxRes = xRes < yRes ? yRes : xRes;
    map.getView().setResolution(maxRes);
    map.getView().calculateExtent(map.getSize())
}

// OpenStreetMap地图
function switch2OSM(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(openStreetMapLayer);
}

// Bing地图
function switch2BingMap(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(bingMapLayer);
}

// Stamen地图
function switch2StamenMap(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(stamenLayer);
}

// MapQuest地图
function switch2MapQuest(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(mapQuestLayer);
}

// 万能瓦片地图：Open Street Map
function switchAMapXYZLayerMap(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(openStreetMapXYZLayerMap);
}

// 万能瓦片地图：高德地图
function switchAMapXYZLayerMap(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(AMapXYZLayerMap);
}

// 万能瓦片地图：Yahoo地图
function switchYahooXYZLayerMap(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(YahooXYZLayerMap);
}

// 万能瓦片地图：百度地图
function switchBaiduXYZLayerMap(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(BaiduXYZLayerMap);
}

// 万能瓦片地图：Bing地图
function switchBingMapLayerXYZMap(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(BingMapLayerXYZMap);
}

// 万能瓦片地图：Google地图
function switchGoogleMapLayerXYZMap(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(GoogleMapLayerXYZMap);
}

// 离线加载瓦片地图
function switchOfflineMapLayerMap(){
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(OfflineMapLayerMap);
}

// 静态地图
function showStaticMap(){
    // 地图设置中心，设置到成都，在本地离线地图 offlineMapTiles刚好有一张zoom为4的成都瓦片
    var center = ol.proj.transform([104.06667, 30.66667], 'EPSG:4326', 'EPSG:3857');
    // 计算熊猫基地地图映射到地图上的范围，图片像素为 550*344，保持比例的情况下，把分辨率放大一些
    var extent = [center[0]- 550*1000/2, center[1]-344*1000/2, center[0]+550*1000/2, center[1]+344*1000/2];
    var view = map.getView();
    view.setCenter(center);
    view.setZoom(7);
    map.removeLayer(map.getLayers().item(0));
    map.addLayer(new ol.layer.Image({
        source: new ol.source.ImageStatic({
            url: 'src/img/pandaBase.jpg',  // 熊猫基地地图
            imageExtent: extent            // 映射到地图的范围
        })
    }));
    map.render();

    // 创建一个用于放置活动图标的layer
    var activityLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    
    // 创建一个活动图标需要的Feature，并设置位置
    var activity = new ol.Feature({
        geometry: new ol.geom.Point([center[0]-550*1000/2+390*1000, center[1]-344*1000/2+(344-145)*1000])
    });

    // 设置Feature的样式，使用小旗子图标
    activity.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            src: 'src/img/flag_right.png',
            anchor: [0, 1],
            scale: 0.2
        })
    }));

    // 添加活动Feature到layer上，并把layer添加到地图中
    activityLayer.getSource().addFeature(activity);
    map.addLayer(activityLayer);
}

// 矢量地图
function showVectorMap(){
    map.removeLayer(map.getLayers().item(0));

    // 底图用Open Street Map 地图
    map.addLayer(new ol.layer.Tile({
        source: new ol.source.OSM()
    }));

    var view = map.getView();
    view.setCenter([-72.980624870461128, 48.161307640513321]);
    view.setZoom(3);
    map.render();
    
    // 再加载一个geojson的矢量地图
    // var vectorLayer = new ol.layer.Vector({
    //     source: new ol.source.Vector({
    //         url: 'data/geojson/line-samples.geojson',        // 地图来源
    //         format: new ol.format.GeoJSON()                  // 解析矢量地图的格式化类
    //     })
    // });

    // 因为是异步加载，所以要采用事件监听的方式来判定是否加载完成
    // var listenerKey = vectorLayer.getSource().on('change', function(){
    //     // 判定是否加载完成
    //     console.log(vectorLayer.getSource().getState());
    //     if(vectorLayer.getSource().getState() === 'ready'){
    //         document.getElementById('count').innerHTML = vectorLayer.getSource().getFeatures().length;
    //         // 注销监听器
    //         vectorLayer.getSource().unByKey(listenerKey);
    //     }
    // });

    // 使用ajax获取矢量地图数据
    $.ajax({
        url: 'data/geojson/line-samples.geojson',
        success: function(data, status){
            // 成功获取到数据内容后，调用方法添加到地图
            addGeoJSON(data);
        }
    });
    
    

    // map.addLayer(vectorLayer);
}

// 加载矢量地图
function addGeoJSON(src){
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            // 用readFeatures方法可以自定义坐标系
            features: (new ol.format.GeoJSON()).readFeatures(src, {
                dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
                featureProjection: 'EPSG:3857' // 设定当前地图使用的feature的坐标系
            })
        })
    });

    map.addLayer(layer);
}