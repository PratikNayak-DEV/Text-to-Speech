document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const rateInput = document.getElementById('rate');
    const pitchInput = document.getElementById('pitch');
    const volumeInput = document.getElementById('volume');
    const rateValue = document.getElementById('rate-value');
    const pitchValue = document.getElementById('pitch-value');
    const volumeValue = document.getElementById('volume-value');
    const speakBtn = document.getElementById('speak-btn');
    const stopBtn = document.getElementById('stop-btn');
  
    let voices = [];
    let currentVoice = null;
    let isSpeaking = false;
  
    // Initialize voices
    function loadVoices() {
      voices = window.speechSynthesis.getVoices();
      voiceSelect.innerHTML = `
        <option value="">Select a voice</option>
        ${voices.map(voice => `
          <option value="${voice.voiceURI}">
            ${voice.name} (${voice.lang})
          </option>
        `).join('')}
      `;
    }
  
    // Load voices when available
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  
    // Update display values
    function updateValue(input, display, isPercentage = false) {
      const value = input.value;
      display.textContent = isPercentage ? `${Math.round(value * 100)}%` : value;
    }
  
    // Event listeners for range inputs
    rateInput.addEventListener('input', () => updateValue(rateInput, rateValue));
    pitchInput.addEventListener('input', () => updateValue(pitchInput, pitchValue));
    volumeInput.addEventListener('input', () => updateValue(volumeInput, volumeValue, true));
  
    // Voice selection
    voiceSelect.addEventListener('change', (e) => {
      currentVoice = voices.find(voice => voice.voiceURI === e.target.value);
      updateSpeakButtonState();
    });
  
    // Text input
    textInput.addEventListener('input', updateSpeakButtonState);
  
    function updateSpeakButtonState() {
      speakBtn.disabled = !textInput.value.trim() || !currentVoice || isSpeaking;
    }
  
    // Speech synthesis
    function speak() {
      if (!textInput.value.trim() || !currentVoice) return;
  
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
  
      const utterance = new SpeechSynthesisUtterance(textInput.value);
      utterance.voice = currentVoice;
      utterance.rate = parseFloat(rateInput.value);
      utterance.pitch = parseFloat(pitchInput.value);
      utterance.volume = parseFloat(volumeInput.value);
  
      utterance.onstart = () => {
        isSpeaking = true;
        speakBtn.disabled = true;
        stopBtn.disabled = false;
        
        // Update button content
        speakBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="22"></line>
          </svg>
          Speaking...
        `;
      };
  
      utterance.onend = utterance.onerror = () => {
        isSpeaking = false;
        speakBtn.disabled = false;
        stopBtn.disabled = true;
        
        // Restore button content
        speakBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Speak
        `;
        updateSpeakButtonState();
      };
  
      window.speechSynthesis.speak(utterance);
    }
  
    function stopSpeaking() {
      window.speechSynthesis.cancel();
    }
  
    // Button event listeners
    speakBtn.addEventListener('click', speak);
    stopBtn.addEventListener('click', stopSpeaking);
  
    // Initialize display values
    updateValue(rateInput, rateValue);
    updateValue(pitchInput, pitchValue);
    updateValue(volumeInput, volumeValue, true);
  });