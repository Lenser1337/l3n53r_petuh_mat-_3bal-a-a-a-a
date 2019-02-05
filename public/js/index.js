$(document).ready(function() {

  /* Onboarding */

  function circleBounceRepeat() {
    circleBounce.invalidate().restart();
  }

  var onboard = $('.onboard');
  var obcircle = $('.obcircle');
  var circleBounce = new TimelineMax({
    onComplete: circleBounceRepeat
  });

  var ob = new TimelineMax();

  circleBounce.fromTo(obcircle, 1, {
    transformOrigin: '50% 50%',
    scale: 0.8
  }, {
    transformOrigin: '50% 50%',
    scale: 1.2
  }).to(obcircle, 1, {
    transformOrigin: '50% 50%',
    scale: 0.8
  });

  ob.to(onboard, 4.5, {
    opacity: 1
  }).to(onboard[0], 0.90, {
    opacity: 0
  }).to(onboard[1], 0.90, {
    opacity: 0
  }).to(onboard[2], 0.90, {
    opacity: 0
  }).to(onboard[3], 0.90, {
    opacity: 0
  }).to(onboard[4], 0.90, {
    opacity: 0
  }).to(onboard[5], 0.90, {
    opacity: 0
  });

  $(document).click(function() {
    onboard.css('display', 'none');
  });

  /* Macintosh */

  var mac = new TimelineMax();
  var mouse = $('.mouse');
  var screencode = $('.screen');
  var lines = $('.lines');

  mac.set(screencode, {
    opacity: 0
  });

  mac.set(lines, {
    opacity: 0.5,
    drawSVG: 0
  });

  mac.pause();

  mouse.click(function() {
    mac.play();
    mac.restart();
  });

  mac.to(screencode, 1.5, {
    opacity: 1
  }).to(lines[0], 3, {
    opacity: 0.5,
    drawSVG: true
  }).to(lines[1], 3, {
    opacity: 0.5,
    drawSVG: true
  }).to(lines[2], 3, {
    opacity: 0.5,
    drawSVG: true
  }).to(lines[3], 3, {
    opacity: 0.5,
    drawSVG: true
  }).to(lines[4], 3, {
    opacity: 0.5,
    drawSVG: true
  }).to(lines[5], 3, {
    opacity: 0.5,
    drawSVG: true
  }).to(lines[6], 3, {
    opacity: 0.5,
    drawSVG: true
  }).to(lines, 1, {
    delay: 2,
    opacity: 0
  }).to(screencode, 1.5, {
    opacity: 0
  });

  /* Calendar */

  var d = new Date();
  var numDay = d.getDate();
  var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май',
    'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь',
    'Декабрь'
  ];
  var monthName = monthNames[d.getMonth()].toUpperCase();
  var monthEl = $('.monthname');
  var dayEl = $('.daynum');

  monthEl.html(monthName);
  dayEl.html(numDay);

  /* Bike */

  var bike = new TimelineMax();
  var rideRight = $('.bike__right');
  var rideLeft = $('.bike__left');
  var pedalerFront = $('.pedaler-front');
  var pedalerBack = $('.pedaler-back');
  var tray = $('.tray');
  var wheels = $('.wheel');
  var pedalFront = $('.pedal-front');
  var pedalBack = $('.pedal-back');
  var timingRotation = 12;

  bike.set(rideRight, {
    x: window.innerWidth - 400
  });

  bike.pause();
  rideRight.click(function() {
    bike.play();
  });

  bike.to(wheels, timingRotation, {
      rotation: 1080,
      transformOrigin: '50% 50%'
    }, 'a').to(tray, timingRotation, {
      rotation: 1080,
      transformOrigin: '50% 50%'
    }, 'a').to(rideRight, 4, {
      x: window.innerWidth + 100
    }, 0).fromTo(rideLeft, 8, {
      x: -320
    }, {
      x: 50
    }, 4).to(pedalerFront, timingRotation, {
      transformOrigin: '3.4px 3.5px',
      rotation: 1080
    }, 'a').to(pedalerBack, timingRotation, {
      transformOrigin: '45px 3.5px',
      rotation: 1080
    }, 'a').to(pedalFront, timingRotation, {
      transformOrigin: '50% 50%',
      rotation: -1080
    }, 'a')
    .to(pedalBack, timingRotation, {
      transformOrigin: '50% 50%',
      rotation: -1080
    }, 'a');

  /* Cactus */

  var cac = new TimelineMax();
  var pics = $('.pics');

  cac.play();

  cac.set(pics, {
    y: 80
  }).to(pics, 20, {
    y: 0,
    delay: 5
  });

  /* Coffee Machine */

  var cm = new TimelineMax();
  var starter = $('.chemex');
  var water = $('.water');
  var drops = $('.drops');
  var liquidVert = $('.liquid-vertical');
  var liquidHori = $('.liquid-horizontal');
  var liquidMidd = $('.liquid-middle');
  var filter = $('.filter');
  var material = $('.chemex-material');
  var smoke = $('.smoke');

  cm.pause();

  starter.click(function() {
    cm.play();
    cm.restart();
  });

  cm.fromTo(water, 0.5, {
    opacity: 0,
  }, {
    opacity: 1,
  }).to(water, 1.75, {
    y: 42,
  }).to(water, 2, {
    autoAlpha: 0
  }).fromTo(drops, 6, {
    opacity: 0,
    y: -30
  }, {
    opacity: 1,
    y: 15,
  }, 2.45).to(drops, 1, {
    opacity: 0,
    y: 30
  }).fromTo(liquidVert, 3, {
    opacity: 0,
    y: 10
  }, {
    opacity: 1,
    y: 0
  }, 5).to(filter, 1, {
    opacity: 0
  }, 8).to(material, 2.5, {
    rotation: 90,
    transformOrigin: '100% 50%',
    y: 2.5
  }, 'b').to(liquidVert, 0.1, {
    delay: 0,
    opacity: 0
  }, 'b').fromTo(liquidMidd, 2.5, {
    opacity: 0
  }, {
    opacity: 1
  }, 'b').to(liquidMidd, 2.5, {
    opacity: 0
  }).fromTo(liquidHori, 2.5, {
    opacity: 0
  }, {
    opacity: 1,
  }, 'b').to(liquidHori, 2.5, {
    opacity: 0
  }).fromTo(smoke, 5.5, {
    y: 22.5
  }, {
    y: 0
  }, 'a').to(material, 1.5, {
    y: 0,
    rotation: 0
  }, 'a').to(filter, 1.5, {
    delay: 1.5,
    opacity: 1
  }).to(smoke, 12.5, {
    opacity: 0
  }, 'a' + 5);

  /* Clock */

  setInterval(function() {
    function r(el, deg) {
      $('#' + el).attr('transform', 'rotate(' + deg +
        '  43.5 43.5)');
    }
    var d = new Date();

    r('sec', 6 * d.getSeconds());
    r('min', 6 * d.getMinutes());
    r('hour', 30 * (d.getHours() % 12) + d.getMinutes() / 2);
  }, 1000);

  /* Animation switch on/off lamps*/

  var switcherOn = $('.switch--on');
  var switcherOff = $('.switch--off');

  switcherOn.show();
  switcherOff.hide();

  switcherOn.click(function() {
    lamps.play();
    switcherOn.toggle();
    switcherOff.toggle();
  });

  switcherOff.click(function() {
    lamps.reverse(-3);
    switcherOn.toggle();
    switcherOff.toggle();
  });

  /* Animation des lampes */

  var lamps = new TimelineMax();
  var light = $('polygon.light');

  lamps.pause();

  lamps.from(light, 0.5, {
      opacity: 0,
    })
    .to(light, 2.5, {
      opacity: 1
    });


  /* Animation de la fenêtre */

  var winLeft = $('.drag-left');
  var winRight = $('.drag-right');

  Draggable.create(winLeft, {
    type: 'y',
    throwProps: true,
    lockAxis: true,
    cursor: 'ns-resize',
    bounds: {
      minY: 0,
      maxY: 128
    }
  });

  Draggable.create(winRight, {
    type: 'y',
    throwProps: true,
    lockAxis: true,
    cursor: 'ns-resize',
    bounds: {
      minY: 0,
      maxY: 128
    }
  });
});
