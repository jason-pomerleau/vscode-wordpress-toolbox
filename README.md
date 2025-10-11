# The ultimate WordPress snippet collection for Visual Studio Code

* Snippets for every WordPress function, class and constant.
* Easy auto-completion with type hints and tab stops in all the right places.
* Emmet-style abbreviations for all functions. For example, type `gti` for the `get_the_ID` function. (2 letter minimum)
* WordPress Release: **6.8.3**

## Different Snippet Sets

You can toggle between Full or Flat snippet sets. The default snippet set is Full. Please note, when you toggle this setting it will automatically reload the VSCode window to load the new snippet set.


```php
/** Generated Full Snippet (includes argument tabstops) */ 
get_the_title( $post:int|WP_Post )

/** Generated Flat Snippet */ 
get_the_title()
```

Different ways to toggle snippet sets:
- User Settings (UI) > Extensions > WordPress Snippets > Snippet Set
- User Settings (JSON) > Add line: ```"wpSnippets.snippetSet": "Flat",``` (or "Full")
- By command
	- Use Full WordPress Snippets
	- Use Flat WordPress Snippets

## Requirements

These snippets are bound to the PHP language context. Your cursor will need to be inside a set of PHP tags.

They also will work with the Blade language addev by the [laravel-blade](https://marketplace.visualstudio.com/items?itemName=cjhowe7.laravel-blade) extension.