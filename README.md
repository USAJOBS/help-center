# Help

[![Build Status](https://travis-ci.org/USAJOBS/Help.svg?branch=master)](https://travis-ci.org/USAJOBS/Help)

Help Center is an update to the USAJOBS help content. It includes three main sections:

1. FAQs: Frequently Asked Questions about the hiring process.
2. How-Tos: How to do x, y, or z on the USAJOBS we site.
3. Working in Government: Articles detailing what is it like to work within the United States Government.

## Dependencies

The Help Center CSS and JS depend upon the [USAJOBS Design System](https://github.com/USAJOBS/design-system) which in turn depends upon the CSS and JS of the [U.S. Web Design Standards](https://standards.usa.gov/).

### CSS

The Help Center consumes a specific CSS base build created by the USAJOBS Design System that excludes FontAwesome, and the alerts component, which includes FontAwesome directly. This is because production serves FontAwesome from a specific location outside of the design system bundle.

### JS

The Help Center consumes the usajobs-design-system-base.js file and three specific components:

* footer
* modal
* nav

The Help Center then loads its own set of components.

## Deployment

### Development environments

The Help Center is deployed to [github](http://usajobs.github.io/Help/). Different builds of the Help Center are released via [Federalist](https://federalist-proxy.app.cloud.gov/site/usajobs/help/).

### Staging environments

The Help Center is consumed by a script that pulls the content within the ```.usajobs-help-center``` div of each page and puts that content into our database. Those pages are then recreated on the fly with the addition of the header and footer. This is done so that the header can reflect to the user whether or not they are authenticated. We continue to evaluate other options as the performance of static pages would be faster than pulling the content from the database (although the database does perform well today).


## Local Server

### Development environments

The help center uses [Jekyll](https://jekyllrb.com/docs/).

1. Clone this repo:

    ```
    git clone https://github.com/USAJOBS/Help.git
    ```

1. Fetch and update your bundled gems by running:

    ```
    bundle
    ```

1. Run locally:

    ```
    bundle exec jekyll serve
    ```

