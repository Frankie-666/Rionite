let div = document.createElement('div');
div.innerHTML = '<template>1</template>';

let template = div.firstChild;

exports.templateTagSupported = !template.firstChild;
