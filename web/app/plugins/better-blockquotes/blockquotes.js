/*
 * Adds a new custom blockquote button.
 */

(function() {
    tinymce.PluginManager.add( 'better_blockquote', function( editor, url ) {

		var body = [
			{
				type: 'textbox',
				name: 'quote',
				label: better_blockquotes.quote,
				multiline: true,
				minWidth: 300,
				minHeight: 100,
			},
			{
				type: 'textbox',
				name: 'cite',
				label: better_blockquotes.citation,
			},
			{
				type: 'textbox',
				name: 'link',
				label: better_blockquotes.citation_link,
			},
		];

		function submitHandler(e) {
			var blockquote = '';
			var cite = '';

			if ( e.data.link && e.data.cite ) {
				cite = '<cite><a href="' + e.data.link + '" target="_blank">' + e.data.cite + '</a></cite>';
			} else if ( !e.data.link && e.data.cite ) {
				cite = '<cite>' + e.data.cite + '</cite>';
			}

			if ( e.data.quote ) {
				if ( e.data.link ) {
					blockquote += '<blockquote cite="' + e.data.link + '">';
				} else {
					blockquote += '<blockquote>';
				}
				blockquote += e.data.quote;
				blockquote += cite;
				blockquote += '</blockquote>';
			}

			editor.insertContent(blockquote);
		}
		
		editor.addButton( 'better_blockquote', {
            title: better_blockquotes.add_blockquote,
            type: 'button',
            icon: 'blockquote',
            onclick: function() {
	            if ( editor.selection.getContent() ) {
					// originally just wrapping the selected text
					// editor.formatter.toggle('blockquote');
					
					// but we can do better - if not great ...

					// add the selected text as value for the quote field in the popup
					body[0].value = editor.selection.getContent();
				}
				
				// display edit form in a popup
				editor.windowManager.open({
					title: better_blockquotes.blockquote,
					body: body,
					onsubmit: submitHandler
				});

			}
        });

    });
})();
