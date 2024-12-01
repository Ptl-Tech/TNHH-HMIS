const { pulseRate, pain, heigh, weight, temperature, bloodPresure, sP02,respirationRate } = formData[activeTab];
        console.log(pulseRate, pain, heigh, weight, temperature, bloodPresure, sP02,respirationRate);


        const { ...vitalsData } = formData[activeTab];
        const saveVitalsData = {
          ...vitalsData,
        };

        console.log(saveVitalsData);