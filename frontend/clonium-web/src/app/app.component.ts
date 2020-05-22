import {AfterViewInit, Component} from '@angular/core';
import {RectangularLayout} from './shared/utils/board-layouts';

/**
 * @description
 * contains the dark mode configuration
 *
 * @author
 * Rafaa Seddik
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit{
  title = 'clonium-web';
  isDarkMode=false;
  hasDarkModeSet=false;
  constructor() {
    let dark = localStorage.getItem("clonium-dark-mode");
    this.hasDarkModeSet =  localStorage.getItem("clonium-dark-mode") != undefined;
    if(dark === '1'){
      this.isDarkMode=true;
    }
  }

  ngAfterViewInit(): void {
    if(this.isDarkMode)
      document.querySelector('body').classList.add('dark-mode');
  }

  /**
   * @description
   * Toggle the dark mode value
   * @author
   * Rafaa Seddik
   */
  toggleDarkMode(){
    this.isDarkMode = !this.isDarkMode;
    this.hasDarkModeSet=true;
    localStorage.setItem("clonium-dark-mode",this.isDarkMode?'1':'0');
    if(this.isDarkMode)
      document.querySelector('body').classList.add('dark-mode');
    else
      document.querySelector('body').classList.remove('dark-mode');

    return false;
  }
}
