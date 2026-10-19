# BIBLIOGRAPHY

### Project Title: Smart Textile Inventory Management and Demand Forecasting System Using Machine Learning

---

[1] L. Breiman, “Random forests,” *Machine Learning*, vol. 45, no. 1, pp. 5–32, Oct. 2001. DOI: 10.1023/A:1010933404324.

[2] S. Thomassey, “Sales forecasts in clothing industry: The key success factor of the supply chain management,” *International Journal of Production Economics*, vol. 128, no. 2, pp. 470–483, Dec. 2010. DOI: 10.1016/j.ijpe.2010.07.018.

[3] K. J. Ferreira, B. H. A. Lee, and D. Simchi-Levi, “Analytics for an online retailer: Demand forecasting and price optimization,” *Manufacturing & Service Operations Management*, vol. 18, no. 1, pp. 69–88, 2016. DOI: 10.1287/msom.2015.0561.

[4] T. M. Choi, C. L. Hui, N. Liu, S. F. Ng, and Y. Yu, “Fast fashion sales forecasting with limited data and time,” *Decision Support Systems*, vol. 59, pp. 84–92, Mar. 2014. DOI: 10.1016/j.dss.2013.10.008.

[5] S. Punia, K. Nikolopoulos, S. P. Singh, J. K. Madaan, and K. Litsiou, “Deep learning with long short-term memory networks and random forests for demand forecasting in multi-channel retail,” *International Journal of Production Research*, vol. 58, no. 16, pp. 4964–4979, 2020. DOI: 10.1080/00207543.2020.1735666.

[6] R. Carbonneau, K. Laframboise, and R. Vahidov, “Application of machine learning techniques for supply chain demand forecasting,” *European Journal of Operational Research*, vol. 184, no. 3, pp. 1140–1154, Feb. 2008. DOI: 10.1016/j.ejor.2006.12.004.

[7] S. Thomassey and A. Fiordaliso, “A hybrid sales forecasting system based on clustering and decision trees,” *Decision Support Systems*, vol. 42, no. 1, pp. 408–421, Oct. 2006. DOI: 10.1016/j.dss.2005.01.008.

[8] R. J. Hyndman and A. B. Koehler, “Another look at measures of forecast accuracy,” *International Journal of Forecasting*, vol. 22, no. 4, pp. 679–688, 2006. DOI: 10.1016/j.ijforecast.2006.03.001.

[9] A. A. Syntetos and J. E. Boylan, “The accuracy of intermittent demand estimates,” *International Journal of Forecasting*, vol. 21, no. 2, pp. 303–314, Apr. 2005. DOI: 10.1016/j.ijforecast.2004.10.001.

[10] S. Beheshti-Kashi, H. R. Karimi, K.-D. Thoben, M. Lütjen, and M. Teucke, “A survey on retail sales forecasting and prediction in fashion markets,” *Systems Science & Control Engineering*, vol. 3, no. 1, pp. 154–161, 2015. DOI: 10.1080/21642583.2014.999389.

[11] F. Pedregosa, G. Varoquaux, A. Gramfort, V. Michel, B. Thirion, O. Grisel, M. Blondel, P. Prettenhofer, R. Weiss, V. Dubourg, J. Vanderplas, A. Passos, D. Cournapeau, M. Brucher, M. Perrot, and É. Duchesnay, “Scikit-learn: Machine learning in Python,” *Journal of Machine Learning Research*, vol. 12, pp. 2825–2830, Nov. 2011.

[12] W. K. Wong and Z. X. Guo, “A hybrid intelligent model for medium-term sales forecasting in fashion retail supply chains using extreme learning machine and harmony search algorithm,” *International Journal of Production Economics*, vol. 128, no. 2, pp. 614–624, Dec. 2010. DOI: 10.1016/j.ijpe.2010.07.008.

---

### Academic Mapping and Relevance Note

The selected 12 academic publications directly substantiate the engineering and methodology of the **Smart Textile Inventory Management and Demand Forecasting System**:

1. **Theoretical Foundation of Random Forest Regression ([1], [3], [5]):**
   Breiman [1] provides the mathematical justification for bootstrap aggregation (bagging) and random feature subspace selection, explaining why Random Forest resists overfitting and handles high variance. Ferreira et al. [3] and Punia et al. [5] validate the practical efficacy of Random Forest Regression specifically on real-world retail and fashion transaction data, showing how decision tree ensembles capture non-linear demand interactions far better than traditional linear estimators.

2. **Textile and Garment Industry Demand Dynamics ([2], [4], [10], [12]):**
   Textile inventory planning faces distinct challenges: multi-seasonal peaks (such as Pongal and Deepavali festivals in Tamil Nadu), short product lifecycles, and brand-specific consumer behaviors across categories (e.g., traditional dhotis vs. daily innerwear). Thomassey [2], Choi et al. [4], Beheshti-Kashi et al. [10], and Wong & Guo [12] detail how intelligent computational forecasting prevents costly overstocking and out-of-stock scenarios across textile supply chains.

3. **Time-Series Preprocessing, Feature Engineering, and Intermittent Demand ([6], [7], [9]):**
   Individual textile SKUs often encounter intermittent sales (days with zero transactions followed by clustered purchases). Syntetos & Boylan [9] analyze intermittent demand structures, supporting the system's chronological rolling window aggregations and lag features. Carbonneau et al. [6] and Thomassey & Fiordaliso [7] provide the methodology for engineering seasonal calendar flags, price indicators, and previous sales lags into feature matrices for machine learning models.

4. **Rigorous Regression Model Evaluation ([8]):**
   Hyndman & Koehler [8] establish standards for evaluating regression models. This work justifies why scale-dependent regression error metrics—Mean Absolute Error (MAE), Mean Squared Error (MSE), and Root Mean Squared Error (RMSE)—are the correct scientific benchmarks for physical inventory units, rather than classification metrics (precision, recall, ROC-AUC) or volatile percentage errors on intermittent zero-demand data points.

5. **Implementation Architecture ([11]):**
   Pedregosa et al. [11] documents the `scikit-learn` framework utilized in this project for model training, cross-validation, hyperparameter management (100 estimators), and performance metric computation (`mean_absolute_error`, `mean_squared_error`).
