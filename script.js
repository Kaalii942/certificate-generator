document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('participant-name');
    const nameDisplay = document.getElementById('name-display');
    const downloadBtn = document.getElementById('download-btn');
    const certificateWrapper = document.getElementById('certificate-preview');

    const fontSizeInput = document.getElementById('font-size');

    // Update name dynamically
    nameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        nameDisplay.textContent = val || 'Your Name';
    });

    // Handle Font Size
    fontSizeInput.addEventListener('input', (e) => {
        nameDisplay.style.fontSize = `${e.target.value}px`;
    });

    // Handle Download
    downloadBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();

        if (!name) {
            alert('Please enter your name first!');
            nameInput.focus();
            return;
        }

        // Add loading state
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="icon">⌛</span> Generating PDF...';

        try {
            // Using jspdf and html2canvas
            const { jsPDF } = window.jspdf;

            // Set scale for higher quality
            const canvas = await html2canvas(certificateWrapper, {
                scale: 4, // Higher scale for better PDF quality
                useCORS: true,
                logging: false,
                backgroundColor: null
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            // Determine orientation based on image dimensions
            const orientation = canvas.width > canvas.height ? 'l' : 'p';
            const pdf = new jsPDF(orientation, 'px', [canvas.width, canvas.height]);

            // Add image to PDF
            pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

            // Download PDF
            pdf.save(`${name.replace(/\s+/g, '_')}_Certificate.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Something went wrong while generating the PDF. Please try again.');
        } finally {
            // Reset button state
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<span class="icon">⬇</span> Download Certificate';
        }
    });
});
