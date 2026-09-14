/* Program Name: childhoodbppct.sas                            */
/* Program Date: 04/2009                                       */
/*                                                             */
/* Note: This program will import data from users              */
/*       and adds two variables to indicate the percentile     */
/*       of each individual's systolic and diastolic blood     */
/*       pressure                                              */
/* macro variable: maindsn -- data set that contains child's   */
/*                            height,systolic,diastolic        */
/*                            blood pressure, age and sex      */
/* Note: the macro assumes input data set have the following   */
/*       variables:                                            */
/*       id sex age  height sysbp diask5                       */
/*       sex with value: 1 for male; 2 for female              */
/*       age:    age in yrs                                    */
/*       ageflg: if age is an integer then                     */
/*               set ageflg=1: +6.5 months when the age is     */
/*               converted to months in the program;           */
/*               if age is with decimal points then            */
/*               set ageflg=2: +0.5 months when the age is     */
/*               converted to months in the program            */
/*                                                             */
/*       height: in centimeters                                */
/* Note: 12/14/2009 code was added to check if the input       */
/*       height's zscore is in the range of (-3.09)-3.09       */
/*       (0.01%-99.9%); if the height is outside the range     */
/*       it will be set to either -3.09 or 3.09                */
/***************************************************************/

%macro childhoodbppct(maindsn=,         /* input data */
       quantreg='/pc/nhron/Bernie/youthbldpressure/cbp/quantreg_coef.txt',     /* input quantreg coef. */
       htzscore='/pc/nhron/Bernie/youthbldpressure/cbp/ht_zscore.txt',         /* input height info. for kids */
       htzscoreinf='/pc/nhron/Bernie/youthbldpressure/cbp/ht_zscore_inf.txt',   /* input height info. for kids */
       ageflg=1 /* this is added for Marion 1: +6.5 to agemon,2:+0.5 to agemon*/);


  filename quant &quantreg;

  proc import datafile=quant
    out=coef
    dbms=dlm
    replace;
    delimiter=' ';
    getnames=yes;
  run;

  data coef;
    set coef;
    rename x=b1sys x2s=b2sys x3s=b3sys x4s=b4sys
    y=ba1sys y2s=ba2sys y3s=ba3sys y4s=ba4sys
    w=bb1sys w2s=bb2sys w3s=bb3sys w4s=bb4sys
   ;
    if sex='M' then sex1=1;
    else if sex='F' then sex1=2;
    drop sex;
  run;

  data diacoef syscoef;
    set coef(rename=(sex1=sex));

    if type='dia' then output diacoef;
    else if type='sys' then output syscoef;
  run;

  proc sort data=diacoef;
    by sex;
  run;

  %let indsn=diacoef;

  %name(ivar=intercept,ovar=inter, num=1);
  %name(ivar=b1sys, ovar=b1sys, num=2);
  %name(ivar=b2sys, ovar=b2sys, num=3);
  %name(ivar=b3sys, ovar=b3sys, num=4);
  %name(ivar=b4sys, ovar=b4sys, num=5);
  %name(ivar=ba1sys, ovar=ba1sys, num=6);
  %name(ivar=ba2sys, ovar=ba2sys, num=7);
  %name(ivar=ba3sys, ovar=ba3sys, num=8);
  %name(ivar=ba4sys, ovar=ba4sys, num=9);
  %name(ivar=bb1sys, ovar=bb1sys, num=10);
  %name(ivar=bb2sys, ovar=bb2sys, num=11);
  %name(ivar=bb3sys, ovar=bb3sys, num=12);
  %name(ivar=bb4sys, ovar=bb4sys, num=13);

  data diatemp;
     merge temp1 temp2 temp3 temp4 temp5 temp6
    temp7 temp8 temp9 temp10 temp11 temp12 temp13;
     by sex;
  run;
  *proc print data=diatemp;
  *run;

  proc sort data=syscoef;
     by sex;
  run;


  %let indsn=syscoef;

  %name(ivar=intercept,ovar=inter, num=1);
  %name(ivar=b1sys, ovar=b1sys, num=2);
  %name(ivar=b2sys, ovar=b2sys, num=3);
  %name(ivar=b3sys, ovar=b3sys, num=4);
  %name(ivar=b4sys, ovar=b4sys, num=5);
  %name(ivar=ba1sys, ovar=ba1sys, num=6);
  %name(ivar=ba2sys, ovar=ba2sys, num=7);
  %name(ivar=ba3sys, ovar=ba3sys, num=8);
  %name(ivar=ba4sys, ovar=ba4sys, num=9);
  %name(ivar=bb1sys, ovar=bb1sys, num=10);
  %name(ivar=bb2sys, ovar=bb2sys, num=11);
  %name(ivar=bb3sys, ovar=bb3sys, num=12);
  %name(ivar=bb4sys, ovar=bb4sys, num=13);

  data systemp;
     merge temp1 temp2 temp3 temp4 temp5 temp6
    temp7 temp8 temp9 temp10 temp11 temp12 temp13;
     by sex;
  run;

  /* check for the zscore of input height     */
  /* added on 12/14/2009                      */
  filename ht &htzscore;
  filename htinf &htzscoreinf;

  proc import datafile=ht
    out=htage
    dbms=dlm
    replace;
    delimiter=' ';
    getnames=yes;
  run;

  proc import datafile=htinf
    out=htageinf
    dbms=dlm
    replace;
    delimiter=' ';
    getnames=yes;
  run;

  data htage;
     set htage htageinf;
  run;

  proc sort;
     by sex agemon;
  run;

  /* add a check for age range    */
  /* macro works only for 0-17.99 */
  /* the program will stop when   */
  /* max age is > 18              */
  proc sort data=&maindsn;
     by age;
  run;

  data _null_;
     set &maindsn end=_end_;
     by age;
     if _end_ then do;
       exmaxage='N';
       if age >18 then exmaxage='Y';

       call symput('exmaxage', trim(left(exmaxage)) );
     end;
  run;

  %put "maxage" = &exmaxage;
  %if &exmaxage=Y  %then %goto out;

  data &maindsn;
     set &maindsn;
     agemon=round(age*12,1.0);

     %if &ageflg=1 %then %do;
       agemon=agemon+6.5;
     %end;
     %else %if &ageflg=2 %then %do;
       agemon=agemon+0.5;
     %end;
  run;
  proc sort;
     by sex agemon;
  run;

  data &maindsn;
     merge &maindsn(in=a) htage;
     by sex agemon;
     if a;

     outlier=0;
     zschtnw=(((height/m)**l)-1)/(l*s);
     probzht=probnorm(zschtnw);
     ht1 =m*(-3.09*l*s+1)**(1/l);
     ht2 =m*(3.09*l*s+1)**(1/l);

     if height<ht1 or height>ht2  then outlier=1;
   run;

  /* parameters of 5 knots */
  data par;
    sex=1;
    t1m=107.8;
    t2m=140.0;
    t3m=154.5;
    t4m=166.4;
    t5m=179.1;
    ta1m=5.06;
    ta2m=10.79;
    ta3m=13.22;
    ta4m=14.51;
    ta5m=17.30;
    tb1m=-15.;
    tb2m=8.9;
    tb3m=50.375;
    tb4m=112.684;
    tb5m=250.04;
    output;

    sex=2;
    t1m=106.7;
    t2m=140.7;
    t3m=154.0;
    t4m=160.5;
    t5m=168.9;
    ta1m=5.00;
    ta2m=10.70;
    ta3m=13.16;
    ta4m=14.51;
    ta5m=17.33;
    tb1m=6.701;
    tb2m=16.438;
    tb3m=46.80;
    tb4m=84.46;
    tb5m=203.608;
    output;
  run;

  proc sort;
    by sex;
  run;

  /* creates systolic blood pressure for both girls and boys */
  proc sort data=&maindsn;
     by sex;
  run;
  data height;
    merge &maindsn(in=a) systemp par;
    by sex;
    if a;

    x=height;
    y=age;
    if sex=1 then w=(age-10)*(height-150);
    if sex=2 then w=(age-10)*(height-147);

    if x-t1m lt 0 then x2a=0;  else x2a=x-t1m;
    if x-t4m lt 0 then x2b=0;  else x2b=x-t4m;
    if x-t5m lt 0 then x2c=0;  else x2c=x-t5m;
    x2=x2a**3-x2b**3*(t5m-t1m)/(t5m-t4m)+x2c**3*(t4m-t1m)/(t5m-t4m);
    if x-t2m lt 0 then x3a=0;  else x3a=x-t2m;
    x3=x3a**3-x2b**3*(t5m-t2m)/(t5m-t4m)+x2c**3*(t4m-t2m)/(t5m-t4m);
    if x-t3m lt 0 then x4a=0;  else x4a=x-t3m;
    x4=x4a**3-x2b**3*(t5m-t3m)/(t5m-t4m)+x2c**3*(t4m-t3m)/(t5m-t4m);
    x2s=x2/100;
    x3s=x3/100;
    x4s=x4/100;
    if y-ta1m lt 0 then y2a=0;  else y2a=y-ta1m;
    if y-ta4m lt 0 then y2b=0;  else y2b=y-ta4m;
    if y-ta5m lt 0 then y2c=0;  else y2c=y-ta5m;
    y2=y2a**3-y2b**3*(ta5m-ta1m)/(ta5m-ta4m)+y2c**3*(ta4m-ta1m)/(ta5m-ta4m);
    if y-ta2m lt 0 then y3a=0;  else y3a=y-ta2m;
    y3=y3a**3-y2b**3*(ta5m-ta2m)/(ta5m-ta4m)+y2c**3*(ta4m-ta2m)/(ta5m-ta4m);
    if y-ta3m lt 0 then y4a=0;  else y4a=y-ta3m;
    y4=y4a**3-y2b**3*(ta5m-ta3m)/(ta5m-ta4m)+y2c**3*(ta4m-ta3m)/(ta5m-ta4m);
    y2s=y2/100;
    y3s=y3/100;
    y4s=y4/100;
    if w-tb1m lt 0 then w2a=0;  else w2a=w-tb1m;
    if w-tb4m lt 0 then w2b=0;  else w2b=w-tb4m;
    if w-tb5m lt 0 then w2c=0;  else w2c=w-tb5m;
    w2=w2a**3-w2b**3*(tb5m-tb1m)/(tb5m-tb4m)+w2c**3*(tb4m-tb1m)/(tb5m-tb4m);
    if w-tb2m lt 0 then w3a=0;  else w3a=w-tb2m;
    w3=w3a**3-w2b**3*(tb5m-tb2m)/(tb5m-tb4m)+w2c**3*(tb4m-tb2m)/(tb5m-tb4m);
    if w-tb3m lt 0 then w4a=0;  else w4a=w-tb3m;
    w4=w4a**3-w2b**3*(tb5m-tb3m)/(tb5m-tb4m)+w2c**3*(tb4m-tb3m)/(tb5m-tb4m);
    w2s=w2/100**2;
    w3s=w3/100**2;
    w4s=w4/100**2;

    array b0sys{*}  inter1-inter99;
    array b1sys{*}  b1sys1-b1sys99;
    array b2sys{*}  b2sys1-b2sys99;
    array b3sys{*}  b3sys1-b3sys99;
    array b4sys{*}  b4sys1-b4sys99;
    array ba1sys{*} ba1sys1-ba1sys99;
    array ba2sys{*} ba2sys1-ba2sys99;
    array ba3sys{*} ba3sys1-ba3sys99;
    array ba4sys{*} ba4sys1-ba4sys99;
    array bb1sys{*} bb1sys1-bb1sys99;
    array bb2sys{*} bb2sys1-bb2sys99;
    array bb3sys{*} bb3sys1-bb3sys99;
    array bb4sys{*} bb4sys1-bb4sys99;
    array fxsys{*}  fxsys1-fxsys99;
    array difsys{*} difsys1-difsys99;

    do i=1 to 99;
      fxsys{i}=b0sys{i}+b1sys{i}*x+b2sys{i}*x2s+b3sys{i}*x3s+b4sys{i}*x4s
              +ba1sys{i}*y+ba2sys{i}*y2s+ba3sys{i}*y3s+ba4sys{i}*y4s
              +bb1sys{i}*w+bb2sys{i}*w2s+bb3sys{i}*w3s+bb4sys{i}*w4s;
      difsys{i} =abs(sysbp-fxsys{i});
    end;

    psys=min(of difsys1-difsys99);
  run;

  data height;
    set height;

    array difsys{*} difsys1-difsys99;
    do i=1 to 99;
      if psys=difsys{i} then syspct=i;
    end;

    if sysbp=. then syspct=.;

    /* if this person's height is out of 0.1%-99.9% of his(her) age */
    /* set sysbp as missing                                         */
    if outlier=1 then syspct=.;

    keep id sex  age  sysbp psys syspct fxsys: ht1 ht2 agemon outlier;
  run;
  proc sort;
     by id;
  run;

  /* create diastolic blood pressure for girls and boys */
  data all2;
    merge &maindsn(in=a) diatemp par;
    by sex;
    if a;

    x=height;
    y=age;
    if sex=1 then w=(age-10)*(height-150);
    if sex=2 then w=(age-10)*(height-147);

    if x-t1m lt 0 then x2a=0;  else x2a=x-t1m;
    if x-t4m lt 0 then x2b=0;  else x2b=x-t4m;
    if x-t5m lt 0 then x2c=0;  else x2c=x-t5m;
    x2=x2a**3-x2b**3*(t5m-t1m)/(t5m-t4m)+x2c**3*(t4m-t1m)/(t5m-t4m);
    if x-t2m lt 0 then x3a=0;  else x3a=x-t2m;
    x3=x3a**3-x2b**3*(t5m-t2m)/(t5m-t4m)+x2c**3*(t4m-t2m)/(t5m-t4m);
    if x-t3m lt 0 then x4a=0;  else x4a=x-t3m;
    x4=x4a**3-x2b**3*(t5m-t3m)/(t5m-t4m)+x2c**3*(t4m-t3m)/(t5m-t4m);
    x2s=x2/100;
    x3s=x3/100;
    x4s=x4/100;
    if y-ta1m lt 0 then y2a=0;  else y2a=y-ta1m;
    if y-ta4m lt 0 then y2b=0;  else y2b=y-ta4m;
    if y-ta5m lt 0 then y2c=0;  else y2c=y-ta5m;
    y2=y2a**3-y2b**3*(ta5m-ta1m)/(ta5m-ta4m)+y2c**3*(ta4m-ta1m)/(ta5m-ta4m);
    if y-ta2m lt 0 then y3a=0;  else y3a=y-ta2m;
    y3=y3a**3-y2b**3*(ta5m-ta2m)/(ta5m-ta4m)+y2c**3*(ta4m-ta2m)/(ta5m-ta4m);
    if y-ta3m lt 0 then y4a=0;  else y4a=y-ta3m;
    y4=y4a**3-y2b**3*(ta5m-ta3m)/(ta5m-ta4m)+y2c**3*(ta4m-ta3m)/(ta5m-ta4m);
    y2s=y2/100;
    y3s=y3/100;
    y4s=y4/100;
    if w-tb1m lt 0 then w2a=0;  else w2a=w-tb1m;
    if w-tb4m lt 0 then w2b=0;  else w2b=w-tb4m;
    if w-tb5m lt 0 then w2c=0;  else w2c=w-tb5m;
    w2=w2a**3-w2b**3*(tb5m-tb1m)/(tb5m-tb4m)+w2c**3*(tb4m-tb1m)/(tb5m-tb4m);
    if w-tb2m lt 0 then w3a=0;  else w3a=w-tb2m;
    w3=w3a**3-w2b**3*(tb5m-tb2m)/(tb5m-tb4m)+w2c**3*(tb4m-tb2m)/(tb5m-tb4m);
    if w-tb3m lt 0 then w4a=0;  else w4a=w-tb3m;
    w4=w4a**3-w2b**3*(tb5m-tb3m)/(tb5m-tb4m)+w2c**3*(tb4m-tb3m)/(tb5m-tb4m);
    w2s=w2/100**2;
    w3s=w3/100**2;
    w4s=w4/100**2;

    array b0sys{*}  inter1-inter99;
    array b1sys{*}  b1sys1-b1sys99;
    array b2sys{*}  b2sys1-b2sys99;
    array b3sys{*}  b3sys1-b3sys99;
    array b4sys{*}  b4sys1-b4sys99;
    array ba1sys{*}  ba1sys1-ba1sys99;
    array ba2sys{*}  ba2sys1-ba2sys99;
    array ba3sys{*}  ba3sys1-ba3sys99;
    array ba4sys{*}  ba4sys1-ba4sys99;
    array bb1sys{*}  bb1sys1-bb1sys99;
    array bb2sys{*}  bb2sys1-bb2sys99;
    array bb3sys{*}  bb3sys1-bb3sys99;
    array bb4sys{*}  bb4sys1-bb4sys99;
    array fxdias{*}  fxdias1-fxdias99;
    array difdias{*} difdias1-difdias99;

    do i=1 to 99;
      fxdias{i}=b0sys{i}+b1sys{i}*x+b2sys{i}*x2s+b3sys{i}*x3s+b4sys{i}*x4s
               +ba1sys{i}*y+ba2sys{i}*y2s+ba3sys{i}*y3s+ba4sys{i}*y4s
               +bb1sys{i}*w+bb2sys{i}*w2s+bb3sys{i}*w3s+bb4sys{i}*w4s;
      difdias{i} =abs(diask5-fxdias{i});
    end;

    pdias=min(of difdias1-difdias99);
  run;

  data all2;
    set all2;

    array difdias{*} difdias1-difdias99;
    do i=1 to 99;
      if pdias=difdias{i} then diaspct=i;
    end;

    if diask5=. then diaspct=.;

    if outlier=1 then diaspct=.;

    keep id sex age height diask5 diaspct fxdias: zschtnw probzht m l s outlier;
  run;
  proc sort;
     by id;
  run;

  data all;
     merge height all2;
     by id;
  run;

  title "Percentile of Child's systolic and diastolic blood pressure based on height";
  proc print data=all;
    var id sex age height sysbp syspct diask5 diaspct outlier;
  run;
  %goto exit;

  %out: %err_msg(1);
        %goto exit;

%exit: %mend childhoodbppct;

%macro name(ivar,ovar,num);
  proc transpose data=&indsn out=temp&num;
    by sex;
    var &ivar;
  run;

  data temp&num;
    set temp&num;
    array col{*} col1-col99;

    %do i=1 %to 99;
      &ovar&i=col{&i};
    %end;
    drop col1-col99 _NAME_;
  run;
%mend name;

%macro err_msg(err_num);
   %put; %put;
   %put **********************  ERROR IN SAS MACRO BLINPLUS:    **********************;
   %put ******                                                                  ******;

    %if &err_num = 1 %then %do;
     %put ******    The age range of the cohort must bee between 0 and 17.99      ******;
    %end;
%mend err_msg;



