// ==UserScript==
// @name         Sript BOt Pinoy365
// @namespace    Script bot for Pinoy36565
// @version      1.0
// @description  Enhanced bot with internet connection check and auto-update
// @match        https://www.pinoy365.app/m/register?r=unl8126
// @match        https://www.pinoy365.app/m/home*
// @match        https://www.pinoy365.app/m/slot-games*
// @match        https://www.pinoy365.app/*
// @match        https://*.pinoy365.*/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/lycoooo/pinoy365/raw/main/agatt
// @downloadURL  https://github.com/lycoooo/pinoy365/raw/main/agatt
// ==/UserScript==

(function() {
  'use strict';

  // Auto-update checker
  const CURRENT_VERSION = '1.02';
  const UPDATE_URL = 'https://github.com/lycoooo/pinoy365/raw/main/agatt';
  const UPDATE_CHECK_KEY = 'pinoy365bot_lastUpdateCheck';
  const UPDATE_CHECK_INTERVAL = 300000; // Check every 5 minutes

  function checkForUpdates() {
    const lastCheck = localStorage.getItem(UPDATE_CHECK_KEY);
    const now = Date.now();
    
    // Only check if 5 minutes has passed since last check
    if (lastCheck && (now - parseInt(lastCheck)) < UPDATE_CHECK_INTERVAL) {
      return;
    }
    
    // Update last check time
    localStorage.setItem(UPDATE_CHECK_KEY, now.toString());
    
    // Fetch latest version from GitHub
    fetch(UPDATE_URL)
      .then(response => response.text())
      .then(data => {
        // Extract version from fetched script
        const versionMatch = data.match(/@version\s+([\d.]+)/);
        if (versionMatch) {
          const remoteVersion = versionMatch[1];
          
          // Compare versions
          if (compareVersions(remoteVersion, CURRENT_VERSION) > 0) {
            showUpdateNotification(remoteVersion);
          }
        }
      })
      .catch(err => {
        console.log('Update check failed:', err);
      });
  }
  
  // Compare version numbers (returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal)
  function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    
    return 0;
  }

  function showUpdateNotification(newVersion) {
    // Only show once per session
    if (sessionStorage.getItem('updateNotificationShown')) {
      return;
    }
    sessionStorage.setItem('updateNotificationShown', 'true');
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 30px;
      border-radius: 15px;
      z-index: 99999999;
      font-family: monospace;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      max-width: 90%;
      width: 400px;
    `;
    
    notification.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 20px;">🔔 Update Available!</h3>
      <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">
        New version ${newVersion} is available!<br>
        Current version: ${CURRENT_VERSION}<br>
        Click below to update.
      </p>
      <a href="${UPDATE_URL}" target="_blank" style="
        display: inline-block;
        background: #4CAF50;
        color: #fff;
        padding: 12px 30px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        margin-right: 10px;
      ">Update Now</a>
      <button id="dismissUpdate" style="
        background: #f44336;
        color: #fff;
        padding: 12px 30px;
        border-radius: 8px;
        border: none;
        font-weight: bold;
        cursor: pointer;
        font-family: monospace;
      ">Later</button>
      <p style="margin: 15px 0 0 0; font-size: 11px; opacity: 0.7;">
        Made By Lyco
      </p>
    `;
    
    document.body.appendChild(notification);
    
    document.getElementById('dismissUpdate').addEventListener('click', function() {
      document.body.removeChild(notification);
    });
  }

  // Check for updates on script load
  setTimeout(checkForUpdates, 3000);

  // Show message in top-left corner (auto-disappear after 3 seconds)
  function showMessage(msg) {
    const messageBox = document.createElement('div');
    messageBox.textContent = msg;
    messageBox.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.85);
      color: #00ff00;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 9999999;
      font-family: monospace;
      font-size: 13px;
      font-weight: bold;
      border: 2px solid #00ff00;
      box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
      max-width: 350px;
      word-wrap: break-word;
      white-space: pre-line;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(-100%);
          opacity: 0;
        }
      }
    `;
    
    if (!document.querySelector('#messageAnimStyle')) {
      style.id = 'messageAnimStyle';
      document.head.appendChild(style);
    }
    
    document.body.appendChild(messageBox);
    
    // Auto-remove after 3 seconds with fade out animation
    setTimeout(() => {
      messageBox.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (messageBox.parentElement) {
          document.body.removeChild(messageBox);
        }
      }, 300);
    }, 3000);
  }


  // Autofill mobile number
  function fillMobile() {
    const mobileField = document.querySelector('input.form-control.form-mobileNum[placeholder="Mobile No."]');
    if (mobileField) {
      const randomMobile = '9' + Math.floor(100000000 + Math.random() * 900000000);
      mobileField.value = randomMobile;
      mobileField.dispatchEvent(new Event('input', { bubbles: true }));
      showMessage('✅ Mobile No. autofilled: ' + randomMobile);
    } else {
      showMessage('⚠️ Mobile field not found — retrying...');
      setTimeout(fillMobile, 1000);
    }
  }

  // Autofill password (from localStorage)
  function fillPassword() {
    const savedPassword = localStorage.getItem('userPassword');
    if (!savedPassword) {
      showMessage('❌ No password saved! Please configure in Game Launcher.');
      return;
    }
    
    const passwordField = document.querySelector('input[name="password"][placeholder="Password"]');
    if (passwordField) {
      passwordField.value = savedPassword;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      showMessage('✅ Password autofilled');
    } else {
      showMessage('⚠️ Password field not found — retrying...');
      setTimeout(fillPassword, 1000);
    }
  }

  // Autofill confirm password (from localStorage)
  function fillConfirmPassword() {
    const savedPassword = localStorage.getItem('userPassword');
    if (!savedPassword) {
      showMessage('❌ No password saved! Please configure in Game Launcher.');
      return;
    }
    
    const passwordField = document.querySelector('input[name="confimpsw"][placeholder="Kumpirmahin ang password"]');
    if (passwordField) {
      passwordField.value = savedPassword;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('change', { bubbles: true }));
      showMessage('✅ Confirm password autofilled');
    } else {
      showMessage('⚠️ Confirm password not found — retrying...');
      setTimeout(fillConfirmPassword, 1000);
    }
  }

  // Click Magrehistro button with enhanced retry and validation
  let magrehistroRetryCount = 0;
  const MAX_MAGREHISTRO_RETRIES = 30; // 30 retries = 30 seconds max
  
  function clickMagrehistro() {
    // Check if we exceeded max retries
    if (magrehistroRetryCount >= MAX_MAGREHISTRO_RETRIES) {
      showMessage('❌ Failed to register after 30 seconds. Please check internet connection and refresh page.');
      alert('⚠️ Registration failed!\n\nPlease check your internet connection and refresh the page to try again.');
      return;
    }
    
    // Check internet connection first
    if (!navigator.onLine) {
      magrehistroRetryCount++;
      showMessage(`⚠️ No internet connection (${magrehistroRetryCount}/${MAX_MAGREHISTRO_RETRIES}) — waiting...`);
      setTimeout(clickMagrehistro, 1000);
      return;
    }
    
    // Verify all fields are filled before clicking register
    const mobileField = document.querySelector('input.form-control.form-mobileNum[placeholder="Mobile No."]');
    const passwordField = document.querySelector('input[name="password"][placeholder="Password"]');
    const confirmField = document.querySelector('input[name="confimpsw"][placeholder="Kumpirmahin ang password"]');
    
    if (!mobileField || !mobileField.value) {
      magrehistroRetryCount++;
      showMessage(`⚠️ Mobile field not ready (${magrehistroRetryCount}/${MAX_MAGREHISTRO_RETRIES}) — waiting...`);
      setTimeout(clickMagrehistro, 1000);
      return;
    }
    
    if (!passwordField || !passwordField.value) {
      magrehistroRetryCount++;
      showMessage(`⚠️ Password field not ready (${magrehistroRetryCount}/${MAX_MAGREHISTRO_RETRIES}) — waiting...`);
      setTimeout(clickMagrehistro, 1000);
      return;
    }
    
    if (!confirmField || !confirmField.value) {
      magrehistroRetryCount++;
      showMessage(`⚠️ Confirm password not ready (${magrehistroRetryCount}/${MAX_MAGREHISTRO_RETRIES}) — waiting...`);
      setTimeout(clickMagrehistro, 1000);
      return;
    }
    
    // Now look for the register button
    const submitBtn = document.querySelector('button.submit-btn');
    if (submitBtn) {
      // Double-check the button is enabled and visible
      const isDisabled = submitBtn.disabled || submitBtn.hasAttribute('disabled');
      const isVisible = submitBtn.offsetParent !== null;
      
      if (isDisabled) {
        magrehistroRetryCount++;
        showMessage(`⚠️ Register button is disabled (${magrehistroRetryCount}/${MAX_MAGREHISTRO_RETRIES}) — waiting...`);
        setTimeout(clickMagrehistro, 1000);
        return;
      }
      
      if (!isVisible) {
        magrehistroRetryCount++;
        showMessage(`⚠️ Register button not visible (${magrehistroRetryCount}/${MAX_MAGREHISTRO_RETRIES}) — waiting...`);
        setTimeout(clickMagrehistro, 1000);
        return;
      }
      
      // All checks passed - click the button
      submitBtn.click();
      showMessage('✅ Magrehistro button clicked successfully!');
      // Set flag for redirect to home page
      sessionStorage.setItem('justRegistered', 'true');
      // Reset retry counter for next time
      magrehistroRetryCount = 0;
    } else {
      magrehistroRetryCount++;
      showMessage(`⚠️ Magrehistro button not found (${magrehistroRetryCount}/${MAX_MAGREHISTRO_RETRIES}) — retrying...`);
      setTimeout(clickMagrehistro, 1000);
    }
  }

  // Click bonus image (retries until found)
  let bonusClicked = false;
  let bonusRetryCount = 0;
  
  function clickBonusImage() {
    // Prevent clicking bonus multiple times
    if (bonusClicked) {
      showMessage('⏭️ Bonus already clicked, skipping...');
      return;
    }
    
    // Priority 1: Find SPECIFIC bonus image with timestamp 1765944387327
    let bonusImg = document.querySelector('img[src*="1765944387327.png"]');
    
    // Priority 2: Look for it in ticket-game-wrap
    if (!bonusImg) {
      const gameWrap = document.querySelector('.ticket-game-wrap');
      if (gameWrap) {
        bonusImg = gameWrap.querySelector('img[src*="1765944387327.png"]');
      }
    }
    
    // Priority 3: Fallback - any PNG with underscore in ticket folder
    if (!bonusImg) {
      bonusImg = document.querySelector('img[src*="mcs-images/ticket/"][src*="_"][src$=".png"]');
    }
    
    if (bonusImg) {
      showMessage('✅ Clicking bonus image...');
      bonusImg.click();
      bonusClicked = true; // Mark as clicked
      bonusRetryCount = 0; // Reset retry counter
      
      // Wait for Kunin button to appear
      setTimeout(() => {
        clickKuninButton();
      }, 500);
    } else {
      bonusRetryCount++;
      
      // After 10 retries, try swiping to next slide
      if (bonusRetryCount >= 10 && bonusRetryCount % 10 === 0) {
        showMessage('🔄 No bonus found, trying to swipe...');
        const swiperNext = document.querySelector('.swiper-btn-next');
        if (swiperNext) {
          swiperNext.click();
          showMessage('➡️ Swiped to next, searching again...');
        }
      } else {
        showMessage(`❌ Bonus image not found - retry ${bonusRetryCount}...`);
      }
      
      setTimeout(clickBonusImage, 300);
    }
  }

  // Click close button after envelope claim (retries until found)
  function clickCloseButton() {
    const closeBtn = document.querySelector('img.close-amount');
    
    if (closeBtn) {
      showMessage('✅ Clicking close button...');
      closeBtn.click();
      
      setTimeout(() => {
        // Check if this is after bonus 1 or bonus 2
        if (!bonus2Clicked) {
          // After bonus 1 envelope - look for bonus 2
          showMessage('🎉 Envelope 1 closed! Looking for bonus 2...');
          clickBonusImage2();
        } else {
          // After bonus 2 envelope - redirect to slot games!
          showMessage('🎉 All done! Redirecting to slot games...');
          setTimeout(() => {
            window.location.href = 'https://www.pinoy365.app/m/slot-games';
          }, 2000);
        }
      }, 1000);
    } else {
      showMessage('❌ Close button not found - retrying...');
      setTimeout(clickCloseButton, 300);
    }
  }

  // Click second bonus image (timestamp: 1765943759322)
  let bonus2Clicked = false;
  let bonus2RetryCount = 0;
  
  function clickBonusImage2() {
    // Prevent clicking bonus 2 multiple times
    if (bonus2Clicked) {
      showMessage('⏭️ Bonus 2 already clicked!');
      return;
    }
    
    // Look for SPECIFIC second bonus image with timestamp 1765943759322
    let bonusImg2 = document.querySelector('img[src*="1765943759322.png"]');
    
    // Fallback: Look in ticket-game-wrap
    if (!bonusImg2) {
      const gameWrap = document.querySelector('.ticket-game-wrap');
      if (gameWrap) {
        bonusImg2 = gameWrap.querySelector('img[src*="1765943759322.png"]');
      }
    }
    
    if (bonusImg2) {
      showMessage('✅ Clicking bonus 2 image...');
      bonusImg2.click();
      bonus2Clicked = true; // Mark as clicked
      bonus2RetryCount = 0;
      
      // Reset flags to allow second round of Kunin → Envelope → Close
      kuninClicked = false;
      envelopeLoopStarted = false;
      
      // Wait for Kunin button to appear and start the flow again
      setTimeout(() => {
        showMessage('🔄 Starting bonus 2 flow...');
        clickKuninButton();
      }, 500);
    } else {
      bonus2RetryCount++;
      
      // After 10 retries, try swiping to find bonus 2
      if (bonus2RetryCount >= 10 && bonus2RetryCount % 10 === 0) {
        showMessage('🔄 Bonus 2 not found, swiping...');
        const swiperNext = document.querySelector('.swiper-btn-next');
        if (swiperNext) {
          swiperNext.click();
          showMessage('➡️ Swiped, searching for bonus 2...');
        }
      } else {
        showMessage(`❌ Bonus 2 not found - retry ${bonus2RetryCount}...`);
      }
      
      setTimeout(clickBonusImage2, 300);
    }
  }

  // Click Kunin button (retries until found, then starts envelope loop)
  let kuninClicked = false;
  let envelopeLoopStarted = false;
  
  function clickKuninButton() {
    // Prevent clicking Kunin multiple times
    if (kuninClicked) {
      showMessage('⏭️ Kunin already clicked, skipping...');
      return;
    }
    
    const kuninBtn = document.querySelector('div.claim-btn');
    
    if (kuninBtn) {
      showMessage('✅ Clicking Kunin button...');
      kuninBtn.click();
      kuninClicked = true; // Mark as clicked
      
      // Wait 5 seconds then START ENVELOPE LOOP (the only continuous loop)
      setTimeout(() => {
        if (!envelopeLoopStarted) {
          startEnvelopeLoop();
        }
      }, 5000);
    } else {
      showMessage('❌ Kunin button not found - retrying...');
      setTimeout(clickKuninButton, 300);
    }
  }

  // Mobile-only click with visual debug
  function humanClick(element) {
    try {
      // Flash red border to show what we're clicking
      const originalBorder = element.style.border;
      const originalBg = element.style.backgroundColor;
      element.style.border = '5px solid red';
      element.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
      
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Try Method 1: Click on red-envelope-img child if exists
      const imgChild = element.querySelector('.red-envelope-img');
      if (imgChild) {
        try {
          imgChild.click();
          showMessage('✅ Clicked .red-envelope-img child');
        } catch (e) {}
      }
      
      // Try Method 2: Direct click on element
      try {
        element.click();
      } catch (e) {}
      
      // Try Method 3: Click parent element
      if (element.parentElement) {
        try {
          element.parentElement.click();
        } catch (e) {}
      }
      
      // Try Method 4: Look for clickable parent
      let parent = element.parentElement;
      let parentLevel = 0;
      while (parent && parent !== document.body && parentLevel < 3) {
        try {
          parent.click();
        } catch (e) {}
        parent = parent.parentElement;
        parentLevel++;
      }
      
      // Try Method 5: Mobile touch events on element
      const touchObj = new Touch({
        identifier: Date.now(),
        target: element,
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
        pageX: x,
        pageY: y
      });
      
      try {
        element.dispatchEvent(new TouchEvent('touchstart', {
          cancelable: true,
          bubbles: true,
          touches: [touchObj],
          targetTouches: [touchObj],
          changedTouches: [touchObj]
        }));
        
        setTimeout(() => {
          element.dispatchEvent(new TouchEvent('touchend', {
            cancelable: true,
            bubbles: true,
            touches: [],
            targetTouches: [],
            changedTouches: [touchObj]
          }));
        }, 30);
      } catch (e) {}
      
      // Try Method 6: Touch on child image
      if (imgChild) {
        const imgRect = imgChild.getBoundingClientRect();
        const imgX = imgRect.left + imgRect.width / 2;
        const imgY = imgRect.top + imgRect.height / 2;
        
        const imgTouch = new Touch({
          identifier: Date.now() + 1,
          target: imgChild,
          clientX: imgX,
          clientY: imgY,
          screenX: imgX,
          screenY: imgY,
          pageX: imgX,
          pageY: imgY
        });
        
        try {
          imgChild.dispatchEvent(new TouchEvent('touchstart', {
            cancelable: true,
            bubbles: true,
            touches: [imgTouch],
            targetTouches: [imgTouch],
            changedTouches: [imgTouch]
          }));
          
          setTimeout(() => {
            imgChild.dispatchEvent(new TouchEvent('touchend', {
              cancelable: true,
              bubbles: true,
              touches: [],
              targetTouches: [],
              changedTouches: [imgTouch]
            }));
          }, 30);
        } catch (e) {}
      }
      
      // Try Method 7: Tap event
      try {
        element.dispatchEvent(new Event('tap', { bubbles: true, cancelable: true }));
      } catch (e) {}
      
      // Remove highlight
      setTimeout(() => {
        element.style.border = originalBorder;
        element.style.backgroundColor = originalBg;
      }, 800);
      
    } catch (e) {
      showMessage('❌ Error: ' + e.message);
    }
  }

  // Start envelope clicking loop (ONLY THIS LOOPS)
  let envelopeClickInterval;
  let clickedElements = new Set();
  
  function startEnvelopeLoop() {
    // Prevent starting loop multiple times
    if (envelopeLoopStarted) {
      showMessage('⏭️ Envelope loop already running...');
      return;
    }
    
    showMessage('🎯 Starting envelope detection loop...');
    envelopeLoopStarted = true;
    
    // Clear any existing interval
    if (envelopeClickInterval) {
      clearInterval(envelopeClickInterval);
    }
    
    // ONLY envelope detection loops here
    envelopeClickInterval = setInterval(() => {
      let envelopes = [];
      let selectorUsed = 'none';
      
      // PRIMARY: Look for falling rain divs that contain envelopes
      const rainForeground = document.querySelector('.rain.foreground');
      const rainSecond = document.querySelector('.rain.second');
      
      if (rainForeground) {
        // Get all children of rain foreground
        const rainChildren = Array.from(rainForeground.children);
        if (rainChildren.length > 0) {
          envelopes = rainChildren;
          selectorUsed = 'rain.foreground children';
        } else {
          // If no children, the rain div itself might be clickable
          envelopes = [rainForeground];
          selectorUsed = 'rain.foreground div';
        }
      }
      
      if (envelopes.length === 0 && rainSecond) {
        const rainChildren = Array.from(rainSecond.children);
        if (rainChildren.length > 0) {
          envelopes = rainChildren;
          selectorUsed = 'rain.second children';
        } else {
          envelopes = [rainSecond];
          selectorUsed = 'rain.second div';
        }
      }
      
      // Fallback: Look for red-envelope-wrapper
      if (envelopes.length === 0) {
        envelopes = Array.from(document.querySelectorAll('.red-envelope-wrapper'));
        selectorUsed = 'red-envelope-wrapper';
      }
      
      // Fallback: Look inside any visible red-envelope-rain-mask
      if (envelopes.length === 0) {
        const masks = document.querySelectorAll('.red-envelope-rain-mask');
        masks.forEach(mask => {
          const rect = mask.getBoundingClientRect();
          if (rect.width > 100 && rect.height > 100) {
            const children = Array.from(mask.parentElement.querySelectorAll('*'));
            envelopes.push(...children);
            selectorUsed = 'mask parent all elements';
          }
        });
      }
      
      // Filter visible and not clicked
      const visibleEnvelopes = envelopes.filter(el => {
        if (!el || clickedElements.has(el)) return false;
        
        const rect = el.getBoundingClientRect();
        
        return rect.width > 10 && rect.height > 10 && 
               rect.top >= 0 && rect.top <= window.innerHeight &&
               rect.left >= 0 && rect.left <= window.innerWidth;
      });
      
      if (visibleEnvelopes.length > 0) {
        // Pick first visible envelope (fastest falling)
        const envelope = visibleEnvelopes[0];
        const className = envelope.className || 'no-class';
        const tagName = envelope.tagName;
        const rect = envelope.getBoundingClientRect();
        const hasStyle = envelope.hasAttribute('style');
        const styleValue = envelope.getAttribute('style') || 'none';
        
        // Show on screen what we found
        showMessage(`🤖 CLICKING NOW...`);
        
        humanClick(envelope);
        clickedElements.add(envelope);
        
        // STOP THE LOOP after clicking
        clearInterval(envelopeClickInterval);
        envelopeClickInterval = null;
        
        showMessage(`✅ Envelope clicked!`);
        
        // Wait then click close button
        setTimeout(() => {
          clickCloseButton();
        }, 1000);
        
        // Clear from memory after 2 seconds
        setTimeout(() => clickedElements.delete(envelope), 2000);
      } else {
        const maskExists = document.querySelector('.red-envelope-rain-mask');
        showMessage(`⏳ Scanning...`);
      }
    }, 200); // Check every 200ms
  }

  

  // Monitor URL changes for redirect from registration to home (NOT LOOPING)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      if (currentUrl.includes('/m/home')) {
        showMessage('🔄 Redirected to home page');
        setTimeout(clickBonusImage, 1000);
      }
    }
  }).observe(document, {subtree: true, childList: true});

  // Unified search and click game function (works for both Jili Limbo and Jili Mines)
  function searchAndPlayGame(gameName, searchTerm, imageFile) {
    const searchInput = document.querySelector('input.search-input');
    
    if (searchInput) {
      showMessage(`🔍 Searching for ${gameName}...`);
      searchInput.value = searchTerm;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      setTimeout(() => {
        showMessage(`⏳ Waiting for ${gameName} game to appear...`);
        clickGameImage(gameName, imageFile, searchTerm);
      }, 1500);
    } else {
      showMessage('❌ Search input not found - retrying...');
      setTimeout(() => searchAndPlayGame(gameName, searchTerm, imageFile), 300);
    }
  }

  // Unified click game image function
  function clickGameImage(gameName, imageFile, searchTerm) {
    let gameImg = document.querySelector(`img[src*="${imageFile}"]`);
    
    // Fallback: Look for any img-loading in search results
    if (!gameImg) {
      const images = document.querySelectorAll('img.img-loading');
      if (images.length > 0) {
        gameImg = images[0]; // Click first result
      }
    }
    
    if (gameImg) {
      showMessage(`✅ Clicking ${gameName} game...`);
      gameImg.click();
      
      // Try clicking parent if image itself doesn't work
      if (gameImg.parentElement) {
        gameImg.parentElement.click();
      }
      
      setTimeout(() => {
        showMessage('⏳ Waiting for Maglaro button...');
        clickMaglaroButton();
      }, 1500);
    } else {
      showMessage(`❌ ${gameName} game not found - retrying...`);
      setTimeout(() => clickGameImage(gameName, imageFile, searchTerm), 300);
    }
  }

  // Click Maglaro (Play) button
  function clickMaglaroButton() {
    const maglaroBtn = document.querySelector('span');
    
    // Check if it contains "Maglaro" text
    let foundBtn = null;
    if (maglaroBtn) {
      const allSpans = document.querySelectorAll('span');
      for (let span of allSpans) {
        if (span.textContent.includes('Maglaro')) {
          foundBtn = span;
          break;
        }
      }
    }
    
    if (foundBtn) {
      showMessage('✅ Clicking Maglaro button...');
      foundBtn.click();
      
      // Try clicking parent button element
      if (foundBtn.parentElement) {
        foundBtn.parentElement.click();
      }
      
      setTimeout(() => {
        showMessage('🎮 Game started! All automation complete!');
        // Show clear data button after game starts
        showClearDataButton();
      }, 1000);
    } else {
      showMessage('❌ Maglaro button not found - retrying...');
      setTimeout(clickGameImage, 300);
    }
  }

  // Show Clear Data button in front of everything (draggable like Messenger)
  function showClearDataButton() {
    // Create clear data button (top-right corner, same as old display)
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Log Out';
    clearBtn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 15px;
      border-radius: 5px;
      z-index: 9999999;
      font-family: monospace;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid #00ff00;
      cursor: pointer;
      word-wrap: break-word;
      animation: pulse 2s infinite;
      transition: transform 0.2s;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-touch-callout: none;
    `;
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
    
    // Draggable functionality
    let isDragging = false;
    let longPressTimer = null;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let hasMoved = false;
    
    // Touch start - start long press timer
    clearBtn.addEventListener('touchstart', function(e) {
      hasMoved = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      
      // Start long press timer (500ms)
      longPressTimer = setTimeout(() => {
        isDragging = true;
        clearBtn.style.animation = 'none'; // Stop pulse during drag
        clearBtn.style.transform = 'scale(1.1)';
        clearBtn.style.opacity = '0.8';
      }, 500);
    });
    
    // Touch move - drag if long pressed
    clearBtn.addEventListener('touchmove', function(e) {
      if (isDragging) {
        e.preventDefault();
        hasMoved = true;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        // Calculate position
        const rect = clearBtn.getBoundingClientRect();
        const newLeft = currentX - rect.width / 2;
        const newTop = currentY - rect.height / 2;
        
        // Keep within screen bounds
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        const finalLeft = Math.max(0, Math.min(newLeft, maxX));
        const finalTop = Math.max(0, Math.min(newTop, maxY));
        
        clearBtn.style.left = finalLeft + 'px';
        clearBtn.style.top = finalTop + 'px';
        clearBtn.style.right = 'auto';
        clearBtn.style.bottom = 'auto';
      } else {
        // Check if moved too much, cancel long press
        const moveX = Math.abs(e.touches[0].clientX - startX);
        const moveY = Math.abs(e.touches[0].clientY - startY);
        if (moveX > 10 || moveY > 10) {
          clearTimeout(longPressTimer);
        }
      }
    });
    
    // Touch end - finish drag or click
    clearBtn.addEventListener('touchend', function(e) {
      clearTimeout(longPressTimer);
      
      if (isDragging) {
        isDragging = false;
        clearBtn.style.animation = 'pulse 2s infinite'; // Resume pulse
        clearBtn.style.transform = 'scale(1)';
        clearBtn.style.opacity = '1';
      } else if (!hasMoved) {
        // Normal click - show confirmation
        showAirplaneModeMessage();
      }
    });
    
    // Touch cancel - cleanup
    clearBtn.addEventListener('touchcancel', function() {
      clearTimeout(longPressTimer);
      isDragging = false;
      clearBtn.style.animation = 'pulse 2s infinite';
      clearBtn.style.transform = 'scale(1)';
      clearBtn.style.opacity = '1';
    });
    
    // Mouse events for desktop testing
    clearBtn.addEventListener('click', function(e) {
      // Only trigger if not from touch (desktop click)
      if (e.detail > 0 && !hasMoved) {
        showAirplaneModeMessage();
      }
    });
    
    // Prevent context menu on long-press
    clearBtn.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
    
    document.body.appendChild(clearBtn);
  }

  // Show airplane mode message with OK button
  function showAirplaneModeMessage() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 99999999;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    // Create message box
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
      background: #fff;
      padding: 30px 20px;
      border-radius: 15px;
      max-width: 90%;
      width: 350px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    `;
    
    // Message text
    const messageText = document.createElement('p');
    messageText.textContent = 'Please turn on airplane mode before clicking OK';
    messageText.style.cssText = `
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 0 0 20px 0;
      line-height: 1.5;
    `;
    
    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
      display: flex;
      gap: 10px;
      width: 100%;
    `;
    
    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      background: linear-gradient(135deg, #f44336, #d32f2f);
      color: #fff;
      padding: 15px 20px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      flex: 1;
    `;
    
    // Cancel button click handler
    cancelBtn.addEventListener('click', function() {
      // Remove the modal
      document.body.removeChild(overlay);
    });
    
    // OK button
    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.cssText = `
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: #fff;
      padding: 15px 20px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      flex: 1;
    `;
    
    // OK button click handler
    okBtn.addEventListener('click', function() {
      okBtn.textContent = '⏳ Clearing data...';
      okBtn.style.background = 'orange';
      
      // Clear all storage
      try {
        // Save user settings before clearing
        const savedPassword = localStorage.getItem('userPassword');
        const savedGame = localStorage.getItem('userGame');
        
        // Clear localStorage
        localStorage.clear();
        
        // Restore user settings
        if (savedPassword) {
          localStorage.setItem('userPassword', savedPassword);
        }
        if (savedGame) {
          localStorage.setItem('userGame', savedGame);
        }
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Clear cache (if possible)
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        
        okBtn.textContent = 'Log Out Success!';
        okBtn.style.background = 'green';
        
        // Redirect to registration page after 1 second
        setTimeout(() => {
          window.location.href = 'https://www.pinoy365.app/m/register?r=unl8126';
        }, 1000);
        
      } catch (e) {
        okBtn.textContent = '❌ Error: ' + e.message;
        okBtn.style.background = 'red';
      }
    });
    
    // Add buttons to container
    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(okBtn);
    
    // Add elements to message box
    messageBox.appendChild(messageText);
    messageBox.appendChild(btnContainer);
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
  }

  // Floating game launcher icon (appears on all pages)
  function createGameLauncher() {
    const launcherIcon = document.createElement('div');
    launcherIcon.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/11306/11306137.png" style="width: 100%; height: 100%; pointer-events: none; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;">';
    launcherIcon.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: #4CAF50;
      border-radius: 50%;
      z-index: 9999998;
      cursor: pointer;
      box-shadow: 0 5px 20px rgba(0,0,0,0.4);
      transition: transform 0.2s;
      touch-action: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-touch-callout: none;
    `;
    
    // Draggable functionality
    let isDragging = false;
    let longPressTimer = null;
    let startX = 0;
    let startY = 0;
    let hasMoved = false;
    
    launcherIcon.addEventListener('touchstart', function(e) {
      hasMoved = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      
      longPressTimer = setTimeout(() => {
        isDragging = true;
        launcherIcon.style.transform = 'scale(1.1)';
        launcherIcon.style.opacity = '0.8';
      }, 500);
    });
    
    launcherIcon.addEventListener('touchmove', function(e) {
      if (isDragging) {
        e.preventDefault();
        hasMoved = true;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        const rect = launcherIcon.getBoundingClientRect();
        const newLeft = currentX - rect.width / 2;
        const newTop = currentY - rect.height / 2;
        
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        const finalLeft = Math.max(0, Math.min(newLeft, maxX));
        const finalTop = Math.max(0, Math.min(newTop, maxY));
        
        launcherIcon.style.left = finalLeft + 'px';
        launcherIcon.style.top = finalTop + 'px';
        launcherIcon.style.right = 'auto';
        launcherIcon.style.bottom = 'auto';
      } else {
        const moveX = Math.abs(e.touches[0].clientX - startX);
        const moveY = Math.abs(e.touches[0].clientY - startY);
        if (moveX > 10 || moveY > 10) {
          clearTimeout(longPressTimer);
        }
      }
    });
    
    launcherIcon.addEventListener('touchend', function() {
      clearTimeout(longPressTimer);
      
      if (isDragging) {
        isDragging = false;
        launcherIcon.style.transform = 'scale(1)';
        launcherIcon.style.opacity = '1';
      } else if (!hasMoved) {
        showGameLauncherGUI();
      }
    });
    
    launcherIcon.addEventListener('touchcancel', function() {
      clearTimeout(longPressTimer);
      isDragging = false;
      launcherIcon.style.transform = 'scale(1)';
      launcherIcon.style.opacity = '1';
    });
    
    launcherIcon.addEventListener('click', function(e) {
      if (e.detail > 0 && !hasMoved) {
        showGameLauncherGUI();
      }
    });
    
    // Prevent context menu on long-press
    launcherIcon.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
    
    document.body.appendChild(launcherIcon);
  }
  
  // Show game launcher GUI with password and game list
  function showGameLauncherGUI() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 99999998;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    const guiBox = document.createElement('div');
    guiBox.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px 20px;
      border-radius: 20px;
      max-width: 90%;
      width: 400px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    const title = document.createElement('h2');
    title.textContent = 'Pinoy 365 Bot Settings';
    title.style.cssText = `
      color: #fff;
      font-family: monospace;
      font-size: 24px;
      text-align: center;
      margin: 0 0 20px 0;
    `;
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Password for Registration';
    passwordInput.style.cssText = `
      width: 100%;
      padding: 15px;
      border-radius: 10px;
      border: none;
      font-family: monospace;
      font-size: 16px;
      margin-bottom: 20px;
      box-sizing: border-box;
    `;
    
    const gameList = document.createElement('select');
    gameList.style.cssText = `
      width: 100%;
      padding: 15px;
      border-radius: 10px;
      border: none;
      font-family: monospace;
      font-size: 16px;
      margin-bottom: 20px;
      box-sizing: border-box;
      background: #fff;
    `;
    
    const games = [
      { name: 'Select game to play...', value: '' },
      { name: 'Jili Limbo', value: 'limbo' },
      { name: 'Jili Mines', value: 'mines' }
    ];
    
    games.forEach(game => {
      const option = document.createElement('option');
      option.value = game.value;
      option.textContent = game.name;
      gameList.appendChild(option);
    });
    
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
      display: flex;
      gap: 10px;
      width: 100%;
    `;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      background: linear-gradient(135deg, #f44336, #d32f2f);
      color: #fff;
      padding: 15px 20px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      flex: 1;
    `;
    
    cancelBtn.addEventListener('click', function() {
      document.body.removeChild(overlay);
    });
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.cssText = `
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: #fff;
      padding: 15px 20px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      flex: 1;
    `;
    
    // Load saved settings when GUI opens
    const savedPassword = localStorage.getItem('userPassword');
    const savedGame = localStorage.getItem('userGame');
    if (savedPassword) {
      passwordInput.value = savedPassword;
    }
    if (savedGame) {
      gameList.value = savedGame;
    }
    
    saveBtn.addEventListener('click', function() {
      const password = passwordInput.value;
      const selectedGame = gameList.value;
      
      if (!password) {
        alert('Please enter password!');
        return;
      }
      
      if (!selectedGame) {
        alert('Please select a game!');
        return;
      }
      
      // Save settings to localStorage
      localStorage.setItem('userPassword', password);
      localStorage.setItem('userGame', selectedGame);
      
      alert('Settings saved successfully! Please Refresh The Page.');
      document.body.removeChild(overlay);
    });
    
    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(saveBtn);
    
    // Made By Lyco text
    const madeByText = document.createElement('p');
    madeByText.textContent = 'Made By Lyco';
    madeByText.style.cssText = `
      color: rgba(255, 255, 255, 0.7);
      font-family: monospace;
      font-size: 12px;
      text-align: center;
      margin: 15px 0 0 0;
      font-style: italic;
    `;
    
    guiBox.appendChild(title);
    guiBox.appendChild(passwordInput);
    guiBox.appendChild(gameList);
    guiBox.appendChild(btnContainer);
    guiBox.appendChild(madeByText);
    overlay.appendChild(guiBox);
    document.body.appendChild(overlay);
  }
  
  // Launch game function with game configurations
  function launchGame(gameName) {
    // Navigate to slot-games page first if not already there
    if (!window.location.href.includes('/m/slot-games')) {
      window.location.href = 'https://www.pinoy365.app/m/slot-games';
      // Store the game to launch after redirect
      localStorage.setItem('pendingGameLaunch', gameName);
      return;
    }
    
    // Game configurations (name, search term, image file)
    const gameConfigs = {
      limbo: { name: 'Jili Limbo', search: 'limbo', image: 'JL0115.avif' },
      mines: { name: 'Jili Mines', search: 'mines', image: 'JL0110.avif' }
    };
    
    // Launch the selected game using unified function
    const config = gameConfigs[gameName];
    if (config) {
      searchAndPlayGame(config.name, config.search, config.image);
    }
  }
  
  // Search and click game (Enhanced fallback method)
  function searchAndClickGame(searchTerm, imageFile) {
    const searchInput = document.querySelector('input[placeholder="Maghanap"]') || document.querySelector('input.search-input');
    
    if (searchInput) {
      showMessage(`🔍 Searching for ${searchTerm}...`);
      searchInput.value = searchTerm;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      setTimeout(() => {
        showMessage(`⏳ Looking for ${searchTerm} game...`);
        const gameImages = document.querySelectorAll('img');
        let gameFound = false;
        
        for (let img of gameImages) {
          if (img.src && img.src.includes(imageFile)) {
            showMessage(`✅ Clicking ${searchTerm} game...`);
            img.click();
            
            // Try clicking parent if image itself doesn't work
            if (img.parentElement) {
              img.parentElement.click();
            }
            
            setTimeout(() => {
              clickMaglaroButton();
            }, 1500);
            gameFound = true;
            break;
          }
        }
        
        if (!gameFound) {
          showMessage(`❌ ${searchTerm} game not found - retrying...`);
          setTimeout(() => searchAndClickGame(searchTerm, imageFile), 500);
        }
      }, 1000);
    } else {
      showMessage('❌ Search input not found - retrying...');
      setTimeout(() => searchAndClickGame(searchTerm, imageFile), 500);
    }
  }

  // Check which page we're on and run appropriate logic (NOT LOOPING)
  const currentUrl = window.location.href;

  // Always show game launcher icon on all pages
  createGameLauncher();
  
  // SECURITY CHECK: Verify registration link is correct
  const validRegisterUrl = 'https://www.pinoy365.app/m/register?r=unl8126';
  if (currentUrl.includes('/m/register') && currentUrl !== validRegisterUrl) {
    showMessage('❌ Invalid registration link! Bot will not run.');
    alert('⚠️ Security Alert!\n\nThis bot only works with the original registration link.\nPlease use: ' + validRegisterUrl);
    return; // Stop bot if wrong registration link
  }
  
  // Check if password is configured
  const savedPassword = localStorage.getItem('userPassword');
  const savedGame = localStorage.getItem('userGame');
  
  if (!savedPassword || !savedGame) {
    showMessage('⚠️ Please configure password and game first!');
    // Automatically open GUI after 1 second
    setTimeout(() => {
      showGameLauncherGUI();
    }, 1000);
    return; // Stop script execution if not configured
  }
  
  // Check if there's a pending game launch
  const pendingGame = localStorage.getItem('pendingGameLaunch');
  if (pendingGame && currentUrl.includes('/m/slot-games')) {
    localStorage.removeItem('pendingGameLaunch');
    setTimeout(() => {
      launchGame(pendingGame);
    }, 1000);
  }

  if (currentUrl.includes('/m/register')) {
    // Registration page - wait for page to fully load, then autofill and submit
    showMessage('📝 Waiting for page to load...');
    
    // Wait for page to be fully ready
    function startRegistration() {
      if (document.readyState !== 'complete') {
        showMessage('⏳ Page still loading — waiting...');
        setTimeout(startRegistration, 500);
        return;
      }
      
      // Check internet connection before starting
      if (!navigator.onLine) {
        showMessage('⚠️ No internet connection — waiting...');
        setTimeout(startRegistration, 1000);
        return;
      }
      
      showMessage('📝 Starting registration...');
      fillMobile();
      fillPassword();
      fillConfirmPassword();
      setTimeout(clickMagrehistro, 2000); // Give more time for fields to settle
    }
    
    startRegistration();
  } else if (currentUrl.includes('/m/home')) {
    // Home page - start bonus sequence (runs once)
    const justRegistered = sessionStorage.getItem('justRegistered');
    if (justRegistered === 'true') {
      showMessage('🎁 Starting bonus claim...');
      sessionStorage.removeItem('justRegistered');
    }
    setTimeout(clickBonusImage, 1000);
  } else if (currentUrl.includes('/m/slot-games')) {
    // Slot games page - search for saved game
    showMessage('🎰 On slot games page...');
    setTimeout(() => {
      launchGame(savedGame);
    }, 2000);
  }

})();
