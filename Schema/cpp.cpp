#include <bits/stdc++.h>
using namespace std;
#define ll long long int

int main() {
   ll t;
   cin>>t;
   while(t--)
   {
      ll b,a;
      cin>>a>>b;
      ll x,y;
      cin>>x>>y;
      bool flag=false;
    //case 1   left side common
    if(((y+b*2)<=a&&y>=b&&((b+1)/2)>=x)||((a-x-b)>=b&&(a-y-b)>=b))
    {
        flag=true;
    }
    //case 2 right side common 
    if(((y+b*2)<=a&&y>=b&&((b+1)/2)>=(a-x-b))||(x>=b&&y>=b))
    {
        flag=true;
    }
    // case 3 top side common
    if((((x+b*2)<=a&&x>=b&&((b+1)/2)>=y))||(((a-x-b)>=b&&y>=b)))
    {
        flag=true;
    }
   // case 3 bottom side common
    if((((x+b*2)<=a&&x>=b&&((b+1)/2)>=(b-y-a)))||(((a-y-b)>=b&&x>=b)))
    {
        flag=true;
    }
    if(flag)
    cout<<"YES"<<endl;
    else
    cout<<"NO"<<endl;
      
   }

    return 0;
}