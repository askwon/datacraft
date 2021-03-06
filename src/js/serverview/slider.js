function initSlider() {

    var forceTitle = document.createElement('div');
    forceTitle.className = 'force-title';
    forceTitle.innerHTML = 'Player Interactions';
    document.getElementsByClassName('container')[0].appendChild(forceTitle);

    var oldWrapper = document.getElementById('wrapper');
    if(oldWrapper) {
        oldWrapper.remove();
    }

    var oldSlider = document.getElementById('uh-slider');
    if(oldSlider) {
        oldSlider.remove();
    }

    var wrapper = document.createElement('div');
    wrapper.id = 'wrapper';
    wrapper.className = 'slider-wrapper';
    document.getElementsByClassName('canvas')[0].appendChild(wrapper);

    var slider = document.createElement('div');
    wrapper.id = 'uh-slider';
    slider.className = 'slider';
    document.getElementsByClassName('slider-wrapper')[0].appendChild(slider);

    d3.select('.slider')
        .call(d3.slider()
              .axis(true)
              .value([ 10, 25 ])
              .on("slide", (evt, value) => value)
        );
}

