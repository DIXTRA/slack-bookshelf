const visibility = {
  in_channel: 'in_channel',
  ephemeral: 'ephemeral',
};

/*
  Block wrapper
  @text: block content
  @type: 'section' | 'header' | ...
*/
function block(text, type = 'section') {
  return { type, text };
}

function divider() {
  return { type: 'divider' };
}

function image(image_url, alt_text = 'image') {
  return { type: 'image', image_url, alt_text };
}

function section(text) {
  return { type: 'section', text };
}

function header(text) {
  return { type: 'header', text: plainText(text) };
}

function sectionWithImage(text, image) {
  return { type: 'section', text, accessory: image };
}

function actions(elements = []) {
  return { type: 'actions', elements };
}

function action(text, value, action_id, style = 'primary', type = 'button') {
  const action =  { type, text, value, action_id };
  if(style !== "default"){
    action.style = style
  }
  return action;
}

function actionStructure(text, value, action_id, style = 'primary', type = 'button') {
  return  { type, text, value, style, action_id };
}

/*
  Plain text UI block
*/
function plainText(text, emoji = true) {
  return {
    type: 'plain_text',
    emoji: emoji,
    text,
  };
}

/*
  Markdown UI block
*/
function markdown(text) {
  return {
    type: 'mrkdwn',
    text,
  };
}

/*
  Context UI block
*/
function context(elements = []) {
  return {
    type: 'context',
    elements,
  };
}

/*
  base object containing blocks array with all UI blocks
*/
function base(blocks = [], inChannel = false) {
  const { in_channel, ephemeral } = visibility;
  const response_type = inChannel ? in_channel : ephemeral;

  return {
    response_type,
    blocks,
  };
}

module.exports = {
  plainText,
  base,
  markdown,
  divider,
  image,
  section,
  header,
  sectionWithImage,
  context,
  actions,
  action,
  actionStructure,
  block,
};
