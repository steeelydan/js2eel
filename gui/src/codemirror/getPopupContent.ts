export const getPopupContent = (
    signature: string,
    text: string,
    example: string | null
): { dom: HTMLElement } => {
    const info = { dom: document.createElement('div') };
    info.dom.style.padding = '6px';
    const signatureEl = document.createElement('pre');
    signatureEl.style.whiteSpace = 'pre-wrap';
    signatureEl.style.marginBottom = '8px';
    signatureEl.innerText = signature;
    const descriptionEl = document.createElement('div');
    text = text.replaceAll('\n', '<br>');
    text = text.replaceAll(/ `/g, ' <code>');
    text = text.replaceAll(/<br>`/g, '<br><code>');
    text = text.replaceAll(/` /g, '</code> ');
    text = text.replaceAll(/`<br>/g, '</code><br>');
    descriptionEl.innerHTML = text;
    info.dom.appendChild(signatureEl);
    info.dom.appendChild(descriptionEl);

    if (example) {
        const exampleHeading = document.createElement('div');
        exampleHeading.innerText = 'Example:\n';
        exampleHeading.style.marginTop = '16px';
        exampleHeading.style.marginBottom = '8px';
        const exampleEl = document.createElement('pre');
        exampleEl.style.whiteSpace = 'pre-wrap';
        exampleEl.innerText = example.split('\n').slice(1, -1).join('\n');

        info.dom.appendChild(exampleHeading);
        info.dom.appendChild(exampleEl);
    }

    return info;
};
