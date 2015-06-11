<a href='http://nscale.nearform.com'>![logo][]</a>

> _A toolkit for application deployments and container management_

__[nscale]__ is an open toolkit supporting configuration, build and deployment of connected container sets. __nscale__ is ideally used to support the development and operation of __microservice__ based systems.

# Digital Ocean Droplet Container
Manages the creation and deployment of a Digital Ocean Droplet for __nscale__. The
`do-droplet-container` is used internally by __nscale__, see __nscale__'s [documentation] for information on how
to deploy using Digitel Ocean as the target platform.

## Running the Tests

Define `DO_TOKEN` in your env.  This is your Digital Ocean API token.  Then run
`npm t`.

## License
Copyright (c) 2014-2015 [nearForm] and other contributors

Licensed under the [Artistic License 2.0]


[nscale]: http://nscale.nearform.com
[logo]: ./_imgs/logo.png
[nearForm]: http://nearform.com
[documentation]: http://github.com/nearform/nscale-docs
[Artistic License 2.0]:./LICENSE
