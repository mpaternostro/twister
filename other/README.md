The "other" directory is where we put stuff that doesn't really have a place, but we don't want them in the root of the project.

# Adding new icons

We rely on [Sly](https://github.com/jacobparis-insiders/sly/tree/main/cli) to add new icons to the 'svg-icons' folder and compile the 'icon.svg' file that we're using as a SVG sprite for [optimal icon performance](https://benadam.me/thoughts/react-svg-sprites/). It also generates a 'icons.json' manifest file for type safety.

To add `pencil-1` icon, run:

```sh
npx sly add @radix-ui/icons pencil-1
```

Credits to the [epic-stack](https://github.com/epicweb-dev/epic-stack).
