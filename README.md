# planet_nine_ha

דברים שחשוב לי לציין:
1. דבר ראשון, זו הפעם הראשונה שאני מתעסק עם רוב הנושאים פה
node.js, react, containers, cache/redis cache
לכן אני מודע לכך שחלקים מסוימים בקוד אינם מושלמים והיה ניתן לפתור דברים בצורות יפות יותר

2. כרגע הפרייקט עובד רק לאחר הקמת דוקרים, אני יודע שאפשר לשנות כמה דברים על מנת שיעבוד גם בהרצה רגילה דרך הטרמינל, אך כרגע לא היה זמן ולא ידעתי כיצד

3. שמתי לב למעט בעיות בעת השימוש באפליקציה (לפעמים נדרשתי ללחיצה כפולה על מנת שהמחיקה תתרחש)
 לא הספקתי להבין בדיוק ממה זה נגרם

 4. בנוסף כמובן שהעיצוב לא קרוב למושלם

 5.  בקובץ server/index.js
 בעת השימוש ברדיס, הדלקתי והתחברתי לרדיס פעם אחת בתחילת התכנית, אך לא סגרתי את החיבור
 בחרתי לעשות זאת מכיוון שהרגיש לי נכון יותר להשאיר את החיבור פתוח כי אני מניח שזה משפר את הביצועים
 מצד שני במקור פתחתי חיבור לפני כל שימוש ברדיס וסגרתי אותו אחרי כל שימוש, כאמור ויתרתי על כך מתוך הנחה שזה לא יעיל, אבל אני לא יודע האם זו באמת הדרך הנכונה לעבוד