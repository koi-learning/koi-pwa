# About
*koi-pwa* is part of the [KOI-System](https://github.com/koi-learning) and implements its user interface.
The *KOI-System* is framework for lifecycle-management of machine learning solutions.
As such it allows the user to create, train, and deploy ML-solutions.
"*KOI*" is an abbreviation of the german name "Kognitive Objekt-orientierte Intelligenz", which translates to "cognitive object-oriented intelligence".

# Debug requirements
To run the application in debug mode, you need to install the following tools:
- Install: [Node.js](https://nodejs.org/en/) (18 LTS)

Then run 
- npm install

In the koi-pwa directory, you can run:
- npm start

Now by default the PWA is accessible at [http://localhost:8080](http://localhost:8080)

The PWA needs an [KOI-Api](https://github.com/koi-learning/koi-api) instance to run.
Connect your local or remote API by setting the ```apiBase``` variable in your browsers local storage.

For Chrome do the following:
- open the development console
- Application -> LocalStorage -> apiBase
- enter the full url to the service endpoint
