function isCollided(box1,box2){
   for(let i = 0; i < 4; i++){
      if(box1.dots[i].x < box2.border.xR 
         && box1.dots[i].x > box2.border.xL
         && box1.dots[i].y > box2.border.yT //Top值比較小，最高為0
         && box1.dots[i].y < box2.border.yB 
      )
      return true;
   }
   for(let i = 0; i < 4; i++){
      if(box2.dots[i].x < box1.border.xR 
         && box2.dots[i].x > box1.border.xL
         && box2.dots[i].y > box1.border.yT
         && box2.dots[i].y < box1.border.yB 
      )
      return true;
   }
   return false;
}
function isExceed(box1, box2){
   // box1是否超過box2
   for(let i = 0; i < 4; i++){
      if(!(box1.dots[i].x < box2.border.xR 
         && box1.dots[i].x > box2.border.xL
         && box1.dots[i].y > box2.border.yT //Top值比較小，最高為0
         && box1.dots[i].y < box2.border.yB)
      )
      return true;
   }
   return false;
}
export {isCollided, isExceed};