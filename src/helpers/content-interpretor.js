import React from 'react';

function applyInlineStyleChanges(block) {
  const text = block.text;
  block.inlineStyleRanges.forEach(sc => {
    const startIndex = sc.offset;
    const endIndex = startIndex + sc.length;
    const relevantText = text.slice(startIndex, endIndex);
  })
}

export default {
  parseChapterData(data) {
    let jsx = [];
    data['blocks'].forEach(block => {
      //sort by text vs. component
      if (block.type === "unstyled") {
        applyInlineStyleChanges(block)
      }
    })
  },
}