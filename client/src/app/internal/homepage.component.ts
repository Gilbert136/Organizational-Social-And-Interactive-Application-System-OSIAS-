import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { sharedFunctions } from '../shared/sharedFunctions';

declare var jquery:any;
declare var $:any;




@Component({
  templateUrl : './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent{
  data : any[];
  
  constructor( private usersService: UsersService, private router : Router, private sharedFunctions: sharedFunctions ){
    this.data = [];
    this.data['allUsers'] = [];
  };
  
  jqueryFunction(){
    //Transitions the menu pages
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: (target.offset().top - 54)
          }, 1000, "easeInOutExpo");
          return false;
        }
      }
    });
  
    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
      $('.navbar-collapse').collapse('hide');
    });
  
    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 54
    });
  
    // Collapse Navbar
    var navbarCollapse = function() {
      // Will works on only the homepage
      if(location.hash.split("/")[2] == "homepage"){
        if ($("#mainNav").offset().top > 100) {
          $("#mainNav").addClass("navbar-shrink");
        } else {
          $("#mainNav").removeClass("navbar-shrink");
        }
      };
    };
    
    // Collapse now if page is not at top
    navbarCollapse();
    
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
  
    // Hide navbar when modals trigger
    $('.portfolio-modal').on('show.bs.modal', function(e) {
      $(".navbar").addClass("d-none");
      
    })
    $('.portfolio-modal').on('hidden.bs.modal', function(e) {
      $(".navbar").removeClass("d-none");
    })
  }
  
  //get all users but also get the necessary attributes not all
  getAllUsers(){
    //the users not to get should be places in a ids list, with thier id
    let ids = []
    const credValue = {
      ids: ids
    };
    //gets all the users except the one who requested for data
    this.usersService.getAllUsers(credValue)
      .subscribe(info =>{
        this.data['allUsers'] = info['users'];
        for(let x = 0; x < this.data['allUsers'].length; x++){
          this.sharedFunctions.showImage(this.data['allUsers'][x], 'users', 'image', 'profilePictures');
        }
        console.log(this.data['allUsers'])
      });
  }
  
  userClick(data){
    this.router.navigate(['/internal/timeline', data['username']]);
  }

  ngOnInit(){
    this.jqueryFunction();
    this.getAllUsers();
  };
}