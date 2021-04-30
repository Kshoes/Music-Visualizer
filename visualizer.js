(function() {

    // Number of bars that should be displayed
    const NBR_OF_BARS = 49;

    // Get the audio source
    const audio = document.querySelector("audio");
    // console.log(audio);

    // Create an audio context using audiocontext API
    const ctx = new AudioContext();

    // Source audio from audio tag
    const audioSource = ctx.createMediaElementSource(audio);

    // Create an audio analyzer from audio context
    const analyzer = ctx.createAnalyser();

    // Connect source to analyzer, then back to context's destination
    audioSource.connect(analyzer);
    audioSource.connect(ctx.destination);

    // Print the analyze frequencies
    const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(frequencyData);
    // console.log("frequencyData", frequencyData);

    // Get the visualizer container
    const visualizerContainer = document.querySelector(".visualizer-container");

    // Create a set of pre-defined bars
    for(let i = 0; i < NBR_OF_BARS; i++) {

        const bar = document.createElement("DIV");
        bar.setAttribute("id", "bar" + i);
        bar.setAttribute("class", "visualizer-container__bar");
        visualizerContainer.appendChild(bar);
    }

    // Adjust bar heights according to frequency data in real time
    function renderFrame() {

        // Update frequency data array with latest frequency data
        analyzer.getByteFrequencyData(frequencyData);
        
        for(let i = 0; i < NBR_OF_BARS; i++) {
            
            const index = (i + 11) * 2;
            const fd = frequencyData[index]; // value between 0 and 255

            const bar = document.querySelector("#bar" + i); // fetch the bar corresponding to the frequency data point
            if(!bar) {
                continue;
            }

            const barHeight = Math.max(4, fd || 0);
            bar.style.height = barHeight + "px";
        }

        // At the next animation frame, call itself
        window.requestAnimationFrame(renderFrame);

    }

    renderFrame();

    audio.volume = .25;
    // audio.play();

})();