# Collapsed Drill-Down Design

Replace view-only groups with model containers wherever click-through detail is required.
The main `simulationDataFlow` view includes Inputs, Definition Tables, Result Tables, GIS
Tables, and Simulation Results as collapsed cards. Each receives one named scoped view;
LikeC4 uses that scoped view as the element's click target.

Inputs contains Input GeoJSON and Weather Input. Definition Tables contains Building and
Zone definition tables. Result Tables contains Zone, Building, and Site Energy result
tables. GIS Tables contains GIS Properties and GIS Result tables. Simulation Results
contains ZoneResult, BuildingResult, and SiteEnergyResult, including their aggregation
relationships.

Feature2Building becomes a model container with Building and multiple Zones nested inside.
It remains expanded in the main view through the `._` selector and stays within the
Simulation Processing view region. All other processing stages remain unchanged.

Properties GeoJSON is removed. Both GIS Properties Table and GIS Result Table export the
single Results GeoJSON output. Validate source and native navigation without exporting PNG.

