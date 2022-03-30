---
date: '4'
title: 'CDOT Construction Duration Predictor'
cover: './cdot-demo.png'
external: 'https://pmodev.codot.gov/contracttimes'
tech:
  - Keras
  - TensorFlow
  - Python
  - Django
---

I built an Artificial Neural Network (ANN) for the Colorado Department of Transportation ([CDOT](https://www.codot.gov/)) to predict the duration of construction for highway projects in Colorado, based upon estimated material quantities and geographic attributes. The ANN proved to be **considerably** faster and more reliable than CDOT's existing methods, and it was also **significantly** more accurate than the traditional linear regression models developed by other academic institutions.

CDOT was so pleased with the results of the ANN that they asked us to package the ANN into [a web app](https://pmodev.codot.gov/contracttimes) that is now used by civil engineers across the state of Colorado for all future CDOT projects. This work was funded by Transportation Pooled Fund [TPF-5(260)](https://pooledfund.org/details/study/489), and additional state DOT representatives that particiapted in the effort have asked us to expand the model to cover their states.
