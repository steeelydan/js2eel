export const getPopupContent = (signature: string, text: string): { dom: HTMLElement } => {
    const info = { dom: document.createElement('div') };
    info.dom.style.padding = '6px';
    const signatureEl = document.createElement('pre');
    signatureEl.style.whiteSpace = 'pre-wrap';
    signatureEl.style.marginBottom = '8px';
    signatureEl.innerText = signature;
    const descriptionEl = document.createElement('div');
    descriptionEl.innerText = text;
    info.dom.appendChild(signatureEl);
    info.dom.appendChild(descriptionEl);

    return info;
};
